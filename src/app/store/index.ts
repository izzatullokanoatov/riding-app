import { createStore } from 'vuex'
import type { RootState } from '@/shared/types'
import { horseModel } from '@/entities/horse'
import { raceModel } from '@/entities/race'
import { notificationModel } from '@/entities/notification'

export const store = createStore<RootState>({
  modules: {
    horse: horseModel,
    race: raceModel,
    notification: notificationModel,
  },
  strict: import.meta.env.DEV,
})
