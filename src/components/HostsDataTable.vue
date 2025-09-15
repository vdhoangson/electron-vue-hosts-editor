<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon left>mdi-table</v-icon>
      {{ $t('table.title') }}
      <v-spacer></v-spacer>
      <!-- Action Buttons -->
      <v-btn color="success" prepend-icon="mdi-plus" @click="handleAddRow" class="mr-2">
        {{ $t('buttons.add') }}
      </v-btn>
      <v-btn
        color="info"
        prepend-icon="mdi-refresh"
        @click="handleReload"
        :disabled="loadingHosts"
        class="mr-2"
      >
        {{ loadingHosts ? $t('buttons.loading') : $t('buttons.refresh') }}
      </v-btn>
      <v-btn
        color="primary"
        prepend-icon="mdi-content-save"
        @click="handleSave"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? $t('buttons.saving') : $t('buttons.save') }}
      </v-btn>
    </v-card-title>

    <!-- Search Input -->
    <v-card-text class="mt-2">
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        :label="$t('table.search')"
        variant="outlined"
        clearable
        density="compact"
        hide-details
        class="mb-3"
      ></v-text-field>
    </v-card-text>

    <v-data-table :headers="headers" :items="filteredRows" class="elevation-1" item-value="index">
      <!-- Enable Column -->
      <template v-slot:item.enabled="{ item }">
        <v-checkbox v-model="item.enabled" hide-details density="compact"></v-checkbox>
      </template>

      <!-- IP Column -->
      <template v-slot:item.ip="{ item }">
        <v-text-field
          v-model="item.ip"
          variant="outlined"
          density="compact"
          hide-details
          :placeholder="$t('placeholders.ip')"
        ></v-text-field>
      </template>

      <!-- Domain Column -->
      <template v-slot:item.domain="{ item }">
        <v-text-field
          v-model="item.domain"
          variant="outlined"
          density="compact"
          hide-details
          :placeholder="$t('placeholders.domain')"
        ></v-text-field>
      </template>

      <!-- Comment Column -->
      <template v-slot:item.comment="{ item }">
        <v-text-field
          v-model="item.comment"
          variant="outlined"
          density="compact"
          hide-details
          :placeholder="$t('placeholders.comment')"
        ></v-text-field>
      </template>

      <!-- Actions Column -->
      <template v-slot:item.actions="{ index }">
        <v-btn icon="mdi-delete" color="error" size="small" @click="handleRemoveRow(index)"></v-btn>
      </template>

      <!-- No data slot -->
      <template v-slot:no-data>
        <div class="text-center pa-4">
          <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
          <div class="text-h6 mt-2">{{ $t('table.noData.title') }}</div>
          <div class="text-body-2 grey--text">{{ $t('table.noData.subtitle') }}</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingHosts: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['add-row', 'remove-row', 'save-hosts', 'reload-hosts', 'update:rows'])

// Local state
const searchQuery = ref('')

// Headers cho v-data-table
const headers = computed(() => [
  {
    title: t('table.headers.enabled'),
    align: 'center',
    sortable: false,
    key: 'enabled',
    width: 120,
  },
  {
    title: t('table.headers.ip'),
    align: 'start',
    sortable: true,
    key: 'ip',
    width: 150,
  },
  {
    title: t('table.headers.domain'),
    align: 'start',
    sortable: true,
    key: 'domain',
    width: 200,
  },
  {
    title: t('table.headers.comment'),
    align: 'start',
    sortable: false,
    key: 'comment',
  },
  {
    title: t('table.headers.actions'),
    align: 'center',
    sortable: false,
    key: 'actions',
    width: 100,
  },
])

// Computed property for filtered rows
const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return props.rows
  }

  const query = searchQuery.value.toLowerCase()
  return props.rows.filter(
    row =>
      row.ip.toLowerCase().includes(query) ||
      row.domain.toLowerCase().includes(query) ||
      row.comment.toLowerCase().includes(query)
  )
})

// Event handlers
function handleAddRow() {
  emit('add-row')
}

function handleRemoveRow(index) {
  emit('remove-row', index)
}

function handleSave() {
  emit('save-hosts')
}

function handleReload() {
  emit('reload-hosts')
}

// Expose methods for parent component
defineExpose({
  searchQuery,
})
</script>
