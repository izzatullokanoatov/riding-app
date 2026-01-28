<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Notification, NotificationType } from '@/shared/types'

const store = useStore()

const notifications = computed<Notification[]>(
  () => store.getters['notification/allNotifications']
)

const remove = (id: string): void => {
  store.dispatch('notification/remove', id)
}

const getNotificationClasses = (type: NotificationType): string => {
  const baseClasses = 'rounded-lg px-4 py-3 shadow-lg flex items-center gap-3'
  
  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-500 text-white`
    case 'error':
      return `${baseClasses} bg-red-500 text-white`
    case 'warning':
      return `${baseClasses} bg-yellow-500 text-gray-900`
    case 'info':
      return `${baseClasses} bg-blue-500 text-white`
    default:
      return `${baseClasses} bg-gray-700 text-white`
  }
}

const getIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return '•'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-[300px] max-w-[400px]">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="getNotificationClasses(notification.type)"
        >
          <span class="text-lg font-bold">
            {{ getIcon(notification.type) }}
          </span>
          <span class="flex-1">{{ notification.message }}</span>
          <button
            class="text-lg font-bold opacity-70 hover:opacity-100 transition-opacity dismiss-btn"
            @click="remove(notification.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { animation: slideIn 0.3s ease-out; }
.toast-leave-active { animation: slideOut 0.3s ease-in; }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
</style>
