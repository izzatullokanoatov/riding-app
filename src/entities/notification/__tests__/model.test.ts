import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { state, getters, mutations, actions } from '../model'
import type { Notification, NotificationsState } from '@/shared/types'

describe('entities/notification/model', () => {
  describe('state', () => {
    it('returns initial state with empty notifications', () => {
      const initialState = state()
      expect(initialState.notifications).toEqual([])
    })

    it('returns a new state object each time', () => {
      const state1 = state()
      const state2 = state()
      expect(state1).not.toBe(state2)
    })
  })

  describe('getters', () => {
    describe('allNotifications', () => {
      it('returns all notifications', () => {
        const mockNotifications: Notification[] = [
          { id: '1', type: 'success', message: 'Test 1', duration: 3000 },
          { id: '2', type: 'error', message: 'Test 2', duration: 5000 },
        ]
        const mockState: NotificationsState = { notifications: mockNotifications }

        expect(getters.allNotifications(mockState)).toEqual(mockNotifications)
      })

      it('returns empty array when no notifications', () => {
        const emptyState: NotificationsState = { notifications: [] }
        expect(getters.allNotifications(emptyState)).toEqual([])
      })
    })
  })

  describe('mutations', () => {
    let testState: NotificationsState

    beforeEach(() => {
      testState = state()
    })

    describe('ADD_NOTIFICATION', () => {
      it('adds notification to state', () => {
        const notification: Notification = {
          id: '1',
          type: 'success',
          message: 'Test message',
          duration: 3000,
        }

        mutations.ADD_NOTIFICATION(testState, notification)

        expect(testState.notifications).toHaveLength(1)
        expect(testState.notifications[0]).toEqual(notification)
      })

      it('adds multiple notifications', () => {
        const notification1: Notification = { id: '1', type: 'success', message: 'Test 1' }
        const notification2: Notification = { id: '2', type: 'error', message: 'Test 2' }

        mutations.ADD_NOTIFICATION(testState, notification1)
        mutations.ADD_NOTIFICATION(testState, notification2)

        expect(testState.notifications).toHaveLength(2)
      })
    })

    describe('REMOVE_NOTIFICATION', () => {
      it('removes notification by id', () => {
        testState.notifications = [
          { id: '1', type: 'success', message: 'Test 1' },
          { id: '2', type: 'error', message: 'Test 2' },
        ]

        mutations.REMOVE_NOTIFICATION(testState, '1')

        expect(testState.notifications).toHaveLength(1)
        expect(testState.notifications[0].id).toBe('2')
      })

      it('does nothing when id not found', () => {
        testState.notifications = [
          { id: '1', type: 'success', message: 'Test 1' },
        ]

        mutations.REMOVE_NOTIFICATION(testState, '999')

        expect(testState.notifications).toHaveLength(1)
      })
    })

    describe('CLEAR_NOTIFICATIONS', () => {
      it('removes all notifications', () => {
        testState.notifications = [
          { id: '1', type: 'success', message: 'Test 1' },
          { id: '2', type: 'error', message: 'Test 2' },
        ]

        mutations.CLEAR_NOTIFICATIONS(testState)

        expect(testState.notifications).toEqual([])
      })
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('notify', () => {
      it('adds notification with generated id', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.notify(context, { type: 'success', message: 'Test message' })

        expect(commit).toHaveBeenCalledWith(
          'ADD_NOTIFICATION',
          expect.objectContaining({
            id: expect.any(String),
            type: 'success',
            message: 'Test message',
            duration: 3000,
          })
        )
      })

      it('uses custom duration when provided', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.notify(context, { type: 'info', message: 'Test', duration: 5000 })

        expect(commit).toHaveBeenCalledWith(
          'ADD_NOTIFICATION',
          expect.objectContaining({ duration: 5000 })
        )
      })

      it('auto-removes notification after duration', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.notify(context, { type: 'success', message: 'Test', duration: 3000 })

        expect(commit).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(3000)

        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenLastCalledWith('REMOVE_NOTIFICATION', expect.any(String))
      })

      it('does not auto-remove when duration is 0', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.notify(context, { type: 'success', message: 'Test', duration: 0 })

        vi.advanceTimersByTime(10000)

        expect(commit).toHaveBeenCalledTimes(1)
      })
    })

    describe('success', () => {
      it('dispatches notify with success type', () => {
        const dispatch = vi.fn()
        const context = { dispatch } as any

        actions.success(context, 'Success message')

        expect(dispatch).toHaveBeenCalledWith('notify', {
          type: 'success',
          message: 'Success message',
        })
      })
    })

    describe('error', () => {
      it('dispatches notify with error type and extended duration', () => {
        const dispatch = vi.fn()
        const context = { dispatch } as any

        actions.error(context, 'Error message')

        expect(dispatch).toHaveBeenCalledWith('notify', {
          type: 'error',
          message: 'Error message',
          duration: 5000,
        })
      })
    })

    describe('warning', () => {
      it('dispatches notify with warning type', () => {
        const dispatch = vi.fn()
        const context = { dispatch } as any

        actions.warning(context, 'Warning message')

        expect(dispatch).toHaveBeenCalledWith('notify', {
          type: 'warning',
          message: 'Warning message',
        })
      })
    })

    describe('info', () => {
      it('dispatches notify with info type', () => {
        const dispatch = vi.fn()
        const context = { dispatch } as any

        actions.info(context, 'Info message')

        expect(dispatch).toHaveBeenCalledWith('notify', {
          type: 'info',
          message: 'Info message',
        })
      })
    })

    describe('remove', () => {
      it('commits REMOVE_NOTIFICATION', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.remove(context, 'notification-id')

        expect(commit).toHaveBeenCalledWith('REMOVE_NOTIFICATION', 'notification-id')
      })
    })

    describe('clear', () => {
      it('commits CLEAR_NOTIFICATIONS', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.clear(context)

        expect(commit).toHaveBeenCalledWith('CLEAR_NOTIFICATIONS')
      })
    })
  })
})
