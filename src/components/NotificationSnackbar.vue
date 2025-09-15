<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="notification.timeout"
    location="top right"
    variant="elevated"
  >
    {{ notification.message }}
    <template v-slot:actions>
      <v-btn
        icon="mdi-close"
        size="small"
        @click="hideNotification"
        :title="$t('notification.close')"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useNotification } from '../composables/useNotification'

const { notification, hideNotification } = useNotification()
</script>
