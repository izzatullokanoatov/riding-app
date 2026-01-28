import type { Horse } from './horse'

export interface RaceRound {
  round: number
  distance: number
  horses: Horse[]
}

export interface HorseResult {
  position: number
  horse: Horse
}

export interface RoundResults {
  round: number
  distance: number
  results: HorseResult[]
}

export type HorsePositions = Record<number, number>
export type HorseSpeeds = Record<number, number>
export type HorseFinishTimes = Record<number, number>

export interface RaceState {
  schedule: RaceRound[]
  currentRound: number
  isRaceInProgress: boolean
  isPaused: boolean
  horsePositions: HorsePositions
  horseSpeeds: HorseSpeeds
  horseFinishTimes: HorseFinishTimes
  results: RoundResults[]
  animationFrameId: number | null
}
