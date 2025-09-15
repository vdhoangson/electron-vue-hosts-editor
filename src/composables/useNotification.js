import { ref } from 'vue'

const notification = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000,
})

export function useNotification() {
  const showNotification = (message, type = 'success', timeout = 3000) => {
    notification.value = {
      show: true,
      message,
      color: getColor(type),
      timeout,
    }
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  const success = (message, timeout = 3000) => {
    showNotification(message, 'success', timeout)
  }

  const error = (message, timeout = 4000) => {
    showNotification(message, 'error', timeout)
  }

  const info = (message, timeout = 3000) => {
    showNotification(message, 'info', timeout)
  }

  const warning = (message, timeout = 3000) => {
    showNotification(message, 'warning', timeout)
  }

  const getColor = type => {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'info':
        return 'info'
      case 'warning':
        return 'warning'
      default:
        return 'success'
    }
  }

  return {
    notification,
    showNotification,
    hideNotification,
    success,
    error,
    info,
    warning,
  }
}
