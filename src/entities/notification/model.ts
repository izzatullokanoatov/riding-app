import type { ActionContext } from 'vuex'
import type { Notification, NotificationType, NotificationsState, RootState } from '@/shared/types'

type NotificationsContext = ActionContext<NotificationsState, RootState>

const DEFAULT_DURATION = 3000

export const state = (): NotificationsState => ({
  notifications: [],
})

export const getters = {
  allNotifications: (state: NotificationsState): Notification[] => state.notifications,
}

export const mutations = {
  ADD_NOTIFICATION(state: NotificationsState, notification: Notification): void {
    state.notifications.push(notification)
  },

  REMOVE_NOTIFICATION(state: NotificationsState, id: string): void {
    state.notifications = state.notifications.filter((n) => n.id !== id)
  },

  CLEAR_NOTIFICATIONS(state: NotificationsState): void {
    state.notifications = []
  },
}

export const actions = {
  notify(
    { commit }: NotificationsContext,
    payload: { type: NotificationType; message: string; duration?: number }
  ): void {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = {
      id,
      type: payload.type,
      message: payload.message,
      duration: payload.duration ?? DEFAULT_DURATION,
    }

    commit('ADD_NOTIFICATION', notification)

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', id)
      }, notification.duration)
    }
  },

  success({ dispatch }: NotificationsContext, message: string): void {
    dispatch('notify', { type: 'success', message })
  },

  error({ dispatch }: NotificationsContext, message: string): void {
    dispatch('notify', { type: 'error', message, duration: 5000 })
  },

  warning({ dispatch }: NotificationsContext, message: string): void {
    dispatch('notify', { type: 'warning', message })
  },

  info({ dispatch }: NotificationsContext, message: string): void {
    dispatch('notify', { type: 'info', message })
  },

  remove({ commit }: NotificationsContext, id: string): void {
    commit('REMOVE_NOTIFICATION', id)
  },

  clear({ commit }: NotificationsContext): void {
    commit('CLEAR_NOTIFICATIONS')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
