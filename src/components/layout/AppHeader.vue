<template>
  <v-row>
    <v-col>
      <v-card class="mb-4" elevation="2">
        <v-card-title class="text-h4 primary white--text d-flex align-center">
          <v-icon left large class="mr-3">mdi-file-document-edit</v-icon>
          {{ $t('app.title') }}
          <v-spacer></v-spacer>
          <!-- Language Selector -->
          <LanguageSelector />
        </v-card-title>
        <v-card-subtitle class="white--text">
          {{ $t('app.subtitle') }}
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const LanguageSelector = defineAsyncComponent(() => import('../LanguageSelector.vue'))
</script>
