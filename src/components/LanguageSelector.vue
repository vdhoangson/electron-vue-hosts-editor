<template>
  <v-select
    v-model="currentLocale"
    :items="availableLocales"
    item-title="name"
    item-value="code"
    :label="$t('language.selector')"
    variant="outlined"
    density="compact"
    hide-details
    class="language-selector"
    style="max-width: 200px"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <span :class="`fi fi-${item.raw.flag} mr-2`" style="font-size: 20px"></span>
        </template>
        {{ item.raw.name }}
      </v-list-item>
    </template>
    <template v-slot:selection="{ item }">
      <span :class="`fi fi-${item.raw.flag} mr-2`" style="font-size: 16px"></span>
      {{ item.raw.name }}
    </template>
  </v-select>
</template>

<script setup>
import { watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { currentLocale, availableLocales, setLocale } = useLanguage()

// Watch for language changes and save to localStorage
watch(currentLocale, newLocale => {
  if (newLocale) {
    setLocale(newLocale)
  }
})
</script>

<style scoped>
.language-selector :deep(.v-field__input) {
  display: flex;
  align-items: center;
}

.language-selector :deep(.fi) {
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
}

.language-selector :deep(.v-list-item .fi) {
  margin-right: 12px;
}
</style>
