import type { HorsesState } from './horse'
import type { RaceState } from './race'
import type { NotificationsState } from './notification'

export interface RootState {
  horse: HorsesState
  race: RaceState
  notification: NotificationsState
}
