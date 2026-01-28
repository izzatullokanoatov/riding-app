import type { ActionContext } from 'vuex'
import type {
  Horse,
  RaceRound,
  RaceState,
  RootState,
  RoundResults,
  HorseResult,
  HorseSpeeds,
} from '@/shared/types'
import {
  ROUND_DISTANCES,
  HORSES_PER_RACE,
  TOTAL_ROUNDS,
  FINISH_LINE_POSITION,
  ROUND_DELAY_MS,
  FALLBACK_HORSE_SPEED,
  FRAME_SPEED,
} from '@/shared/config'
import { selectRandom, calculateHorseSpeed } from '@/shared/lib'

type RaceContext = ActionContext<RaceState, RootState>

export const state = (): RaceState => ({
  schedule: [],
  currentRound: 0,
  isRaceInProgress: false,
  isPaused: false,
  horsePositions: {},
  horseSpeeds: {},
  horseFinishTimes: {},
  results: [],
  animationFrameId: null,
})

export const getters = {
  raceSchedule: (state: RaceState): RaceRound[] => state.schedule,
  currentRoundNumber: (state: RaceState): number => state.currentRound + 1,

  currentRoundData: (state: RaceState): RaceRound | null => {
    return state.schedule[state.currentRound] || null
  },

  currentDistance: (state: RaceState): number => {
    return state.currentRound < TOTAL_ROUNDS ? ROUND_DISTANCES[state.currentRound] : 0
  },

  isRacing: (state: RaceState): boolean => state.isRaceInProgress,
  isPaused: (state: RaceState): boolean => state.isPaused,
  positions: (state: RaceState): Record<number, number> => state.horsePositions,
  allResults: (state: RaceState): RoundResults[] => state.results,

  getRoundResults: (state: RaceState) => (roundIndex: number): RoundResults | null => {
    return state.results[roundIndex] || null
  },

  hasSchedule: (state: RaceState): boolean => state.schedule.length > 0,

  isRaceComplete: (state: RaceState): boolean => {
    return state.currentRound >= TOTAL_ROUNDS && !state.isRaceInProgress
  },

  roundDistances: (): readonly number[] => ROUND_DISTANCES,
}

export const mutations = {
  SET_SCHEDULE(state: RaceState, schedule: RaceRound[]): void {
    state.schedule = schedule
  },

  SET_CURRENT_ROUND(state: RaceState, round: number): void {
    state.currentRound = round
  },

  SET_RACE_IN_PROGRESS(state: RaceState, status: boolean): void {
    state.isRaceInProgress = status
  },

  SET_PAUSED(state: RaceState, status: boolean): void {
    state.isPaused = status
  },

  UPDATE_HORSE_POSITION(state: RaceState, payload: { horseId: number; position: number }): void {
    state.horsePositions[payload.horseId] = payload.position
  },

  RESET_POSITIONS(state: RaceState): void {
    state.horsePositions = {}
  },

  INIT_ROUND_POSITIONS(state: RaceState, horses: Horse[]): void {
    state.horsePositions = {}
    horses.forEach((horse) => {
      state.horsePositions[horse.id] = 0
    })
  },

  SET_HORSE_SPEEDS(state: RaceState, speeds: HorseSpeeds): void {
    state.horseSpeeds = speeds
  },

  SET_HORSE_FINISH_TIME(state: RaceState, payload: { horseId: number; time: number }): void {
    state.horseFinishTimes[payload.horseId] = payload.time
  },

  RESET_FINISH_TIMES(state: RaceState): void {
    state.horseFinishTimes = {}
  },

  ADD_ROUND_RESULTS(state: RaceState, results: RoundResults): void {
    state.results.push(results)
  },

  CLEAR_RESULTS(state: RaceState): void {
    state.results = []
  },

  SET_ANIMATION_FRAME(state: RaceState, frameId: number | null): void {
    state.animationFrameId = frameId
  },

  RESET_RACE(state: RaceState): void {
    state.schedule = []
    state.currentRound = 0
    state.isRaceInProgress = false
    state.isPaused = false
    state.horsePositions = {}
    state.horseSpeeds = {}
    state.horseFinishTimes = {}
    state.results = []
    state.animationFrameId = null
  },
}

export const actions = {
  generateSchedule({ commit, rootGetters }: RaceContext): RaceRound[] | null {
    const allHorses: Horse[] = rootGetters['horse/allHorses']

    if (allHorses.length < HORSES_PER_RACE) {
      console.error('Not enough horses to generate schedule')
      return null
    }

    const schedule: RaceRound[] = ROUND_DISTANCES.map((distance, index) => ({
      round: index + 1,
      distance,
      horses: selectRandom(allHorses, HORSES_PER_RACE),
    }))

    commit('CLEAR_RESULTS')
    commit('SET_CURRENT_ROUND', 0)
    commit('RESET_POSITIONS')
    commit('SET_SCHEDULE', schedule)

    return schedule
  },

  startRace({ commit, state, dispatch }: RaceContext): void {
    if (state.currentRound >= TOTAL_ROUNDS) return

    if (state.isPaused) {
      commit('SET_PAUSED', false)
      dispatch('runRace')
      return
    }

    if (!state.isRaceInProgress) {
      commit('SET_RACE_IN_PROGRESS', true)
      dispatch('runRace')
    }
  },

  pauseRace({ commit, state }: RaceContext): void {
    if (state.isRaceInProgress && !state.isPaused) {
      commit('SET_PAUSED', true)
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId)
        commit('SET_ANIMATION_FRAME', null)
      }
    }
  },

  runRace({ commit, state, dispatch }: RaceContext): void {
    const currentRound = state.schedule[state.currentRound]
    if (!currentRound) return

    if (Object.keys(state.horsePositions).length === 0) {
      commit('INIT_ROUND_POSITIONS', currentRound.horses)
      commit('RESET_FINISH_TIMES')

      const speeds: HorseSpeeds = {}
      currentRound.horses.forEach((horse: Horse) => {
        speeds[horse.id] = calculateHorseSpeed(horse.condition, currentRound.distance)
      })
      commit('SET_HORSE_SPEEDS', speeds)
    }

    const raceLoop = (): void => {
      if (state.isPaused) return

      let allFinished = true

      currentRound.horses.forEach((horse: Horse) => {
        const currentPos = state.horsePositions[horse.id] || 0

        if (currentPos < FINISH_LINE_POSITION) {
          allFinished = false

          const speed = state.horseSpeeds[horse.id] || FALLBACK_HORSE_SPEED
          const frameSpeed = speed * (FRAME_SPEED.BASE + Math.random() * FRAME_SPEED.RANDOM_RANGE)
          const newPos = Math.min(currentPos + frameSpeed, FINISH_LINE_POSITION)

          commit('UPDATE_HORSE_POSITION', { horseId: horse.id, position: newPos })

          if (newPos >= FINISH_LINE_POSITION && !state.horseFinishTimes[horse.id]) {
            commit('SET_HORSE_FINISH_TIME', { horseId: horse.id, time: performance.now() })
          }
        }
      })

      if (allFinished) {
        dispatch('finishRound')
      } else {
        const frameId = requestAnimationFrame(raceLoop)
        commit('SET_ANIMATION_FRAME', frameId)
      }
    }

    raceLoop()
  },

  finishRound({ commit, state, dispatch }: RaceContext): void {
    const currentRound = state.schedule[state.currentRound]

    const sortedHorses = [...currentRound.horses].sort((a, b) => {
      const timeA = state.horseFinishTimes[a.id] || Infinity
      const timeB = state.horseFinishTimes[b.id] || Infinity
      return timeA - timeB
    })

    const results: HorseResult[] = sortedHorses.map((horse, index) => ({
      position: index + 1,
      horse,
    }))

    const roundResults: RoundResults = {
      round: state.currentRound + 1,
      distance: currentRound.distance,
      results,
    }

    commit('ADD_ROUND_RESULTS', roundResults)

    const nextRound = state.currentRound + 1
    commit('SET_CURRENT_ROUND', nextRound)
    commit('RESET_POSITIONS')
    commit('SET_HORSE_SPEEDS', {})
    commit('RESET_FINISH_TIMES')

    if (nextRound >= TOTAL_ROUNDS) {
      commit('SET_RACE_IN_PROGRESS', false)
    } else {
      setTimeout(() => {
        if (!state.isPaused && state.isRaceInProgress) {
          dispatch('runRace')
        }
      }, ROUND_DELAY_MS)
    }
  },

  toggleRace({ state, dispatch }: RaceContext): void {
    if (state.isRaceInProgress && !state.isPaused) {
      dispatch('pauseRace')
    } else {
      dispatch('startRace')
    }
  },

  resetRace({ commit, state }: RaceContext): void {
    if (state.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId)
    }
    commit('RESET_RACE')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
