<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <!-- Header -->
        <AppHeader />

        <!-- Loading Overlay -->
        <v-overlay v-model="loadingHosts" class="align-center justify-center">
          <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
          <div class="text-h6 mt-4">{{ $t('loading.hosts') }}</div>
        </v-overlay>

        <!-- Data Table -->
        <v-row>
          <v-col>
            <HostsDataTable
              :rows="rows"
              :loading="loading"
              :loading-hosts="loadingHosts"
              @add-row="addRow"
              @remove-row="removeRow"
              @save-hosts="saveHosts"
              @reload-hosts="loadHosts"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Notification Snackbar -->
    <NotificationSnackbar />
  </v-app>
</template>

<script setup>
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotification } from './composables/useNotification'

// Dynamic imports for better code-splitting
const NotificationSnackbar = defineAsyncComponent(
  () => import('./components/NotificationSnackbar.vue')
)
const AppHeader = defineAsyncComponent(() => import('./components/layout/AppHeader.vue'))
const HostsDataTable = defineAsyncComponent(() => import('./components/HostsDataTable.vue'))

const { t } = useI18n()
const { success, error, info } = useNotification()
const rows = ref([])
const loading = ref(false)
const loadingHosts = ref(true)

// Lazy load flag-icons CSS only when needed
const loadFlagIcons = () => import('flag-icons/css/flag-icons.min.css')

function addRow() {
  rows.value.push({ enabled: true, ip: '', domain: '', comment: '' })
}

function removeRow(index) {
  rows.value.splice(index, 1)
}

function parseHosts(content) {
  if (!content) return []
  const lines = content.split('\n')
  const parsedRows = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || (trimmed.startsWith('#') && trimmed.length === 1)) continue
    let enabled = true
    let ip = ''
    let domain = ''
    let comment = ''
    if (trimmed.startsWith('#')) {
      enabled = false
      const withoutComment = trimmed.slice(1).trim()
      const parts = withoutComment.split(/\s+/)
      if (parts.length >= 2) {
        ip = parts[0]
        domain = parts[1]
        comment = parts.slice(2).join(' ').replace(/^#/, '').trim()
      }
    } else {
      const parts = trimmed.split(/\s+/)
      if (parts.length >= 2) {
        ip = parts[0]
        domain = parts[1]
        comment = parts.slice(2).join(' ').replace(/^#/, '').trim()
      }
    }
    if (ip && domain) {
      parsedRows.push({ enabled, ip, domain, comment })
    }
  }
  return parsedRows
}

function formatHosts(rows) {
  return rows
    .map(row => {
      const line = `${row.ip} ${row.domain}`
      const fullLine = row.comment ? `${line} # ${row.comment}` : line
      return row.enabled ? fullLine : `# ${fullLine}`
    })
    .join('\n')
}

async function saveHosts() {
  try {
    loading.value = true
    const content = formatHosts(rows.value)
    await window.api.writeHosts(content)
    success(t('messages.saveSuccess'))
  } catch (e) {
    console.error(e)
    error(t('messages.saveError'))
  } finally {
    loading.value = false
  }
}

async function loadHosts() {
  try {
    loadingHosts.value = true
    const data = await window.api.readHosts()
    if (data) {
      rows.value = parseHosts(data)
      success(t('messages.loadSuccess'))
    } else {
      rows.value = []
      info(t('messages.emptyHosts'))
    }
  } catch (err) {
    console.error('Error loading hosts:', err)
    error(t('messages.loadError'))
    rows.value = []
  } finally {
    loadingHosts.value = false
  }
}

onMounted(() => {
  // Lazy load flag icons CSS
  loadFlagIcons()

  // Load hosts data immediately when component mounts
  loadHosts()

  // Also listen for hosts data pushed from main process
  window.api.onHostsLoaded(data => {
    if (data) {
      rows.value = parseHosts(data)
    }
  })

  // Menu event listeners
  window.api.onMenuNewEntry(() => {
    addRow()
  })

  window.api.onMenuSave(() => {
    saveHosts()
  })

  window.api.onMenuReload(() => {
    loadHosts()
  })
})
</script>
