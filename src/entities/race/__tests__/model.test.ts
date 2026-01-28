import { describe, it, expect, vi, beforeEach } from 'vitest'
import { state, getters, mutations, actions } from '../model'
import type { Horse, RaceState, RaceRound } from '@/shared/types'
import { TOTAL_ROUNDS, ROUND_DISTANCES, HORSES_PER_RACE } from '@/shared/config'

describe('entities/race/model', () => {
  const createMockHorses = (count: number): Horse[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      color: `#${String(i).padStart(6, '0')}`,
      condition: 50 + i,
    }))
  }

  describe('state', () => {
    it('returns correct initial state', () => {
      const initialState = state()

      expect(initialState.schedule).toEqual([])
      expect(initialState.currentRound).toBe(0)
      expect(initialState.isRaceInProgress).toBe(false)
      expect(initialState.isPaused).toBe(false)
      expect(initialState.horsePositions).toEqual({})
      expect(initialState.horseSpeeds).toEqual({})
      expect(initialState.horseFinishTimes).toEqual({})
      expect(initialState.results).toEqual([])
      expect(initialState.animationFrameId).toBeNull()
    })
  })

  describe('getters', () => {
    const mockSchedule: RaceRound[] = [
      { round: 1, distance: 1200, horses: createMockHorses(10) },
      { round: 2, distance: 1400, horses: createMockHorses(10) },
    ]

    const mockState: RaceState = {
      schedule: mockSchedule,
      currentRound: 0,
      isRaceInProgress: true,
      isPaused: false,
      horsePositions: { 1: 50, 2: 75 },
      horseSpeeds: { 1: 0.8, 2: 0.9 },
      horseFinishTimes: {},
      results: [],
      animationFrameId: null,
    }

    describe('raceSchedule', () => {
      it('returns the schedule', () => {
        expect(getters.raceSchedule(mockState)).toEqual(mockSchedule)
      })
    })

    describe('currentRoundNumber', () => {
      it('returns 1-indexed round number', () => {
        expect(getters.currentRoundNumber(mockState)).toBe(1)

        const stateRound2 = { ...mockState, currentRound: 1 }
        expect(getters.currentRoundNumber(stateRound2)).toBe(2)
      })
    })

    describe('currentRoundData', () => {
      it('returns current round data', () => {
        expect(getters.currentRoundData(mockState)).toEqual(mockSchedule[0])
      })

      it('returns null when no schedule', () => {
        const emptyState = { ...mockState, schedule: [], currentRound: 0 }
        expect(getters.currentRoundData(emptyState)).toBeNull()
      })
    })

    describe('currentDistance', () => {
      it('returns correct distance for current round', () => {
        expect(getters.currentDistance(mockState)).toBe(1200)

        const stateRound2 = { ...mockState, currentRound: 1 }
        expect(getters.currentDistance(stateRound2)).toBe(1400)
      })

      it('returns 0 when round exceeds total', () => {
        const stateComplete = { ...mockState, currentRound: TOTAL_ROUNDS }
        expect(getters.currentDistance(stateComplete)).toBe(0)
      })
    })

    describe('isRacing', () => {
      it('returns race in progress status', () => {
        expect(getters.isRacing(mockState)).toBe(true)

        const notRacing = { ...mockState, isRaceInProgress: false }
        expect(getters.isRacing(notRacing)).toBe(false)
      })
    })

    describe('isPaused', () => {
      it('returns paused status', () => {
        expect(getters.isPaused(mockState)).toBe(false)

        const paused = { ...mockState, isPaused: true }
        expect(getters.isPaused(paused)).toBe(true)
      })
    })

    describe('positions', () => {
      it('returns horse positions', () => {
        expect(getters.positions(mockState)).toEqual({ 1: 50, 2: 75 })
      })
    })

    describe('hasSchedule', () => {
      it('returns true when schedule exists', () => {
        expect(getters.hasSchedule(mockState)).toBe(true)
      })

      it('returns false when no schedule', () => {
        const noSchedule = { ...mockState, schedule: [] }
        expect(getters.hasSchedule(noSchedule)).toBe(false)
      })
    })

    describe('isRaceComplete', () => {
      it('returns true when all rounds finished', () => {
        const complete = {
          ...mockState,
          currentRound: TOTAL_ROUNDS,
          isRaceInProgress: false,
        }
        expect(getters.isRaceComplete(complete)).toBe(true)
      })

      it('returns false when race in progress', () => {
        const inProgress = {
          ...mockState,
          currentRound: TOTAL_ROUNDS,
          isRaceInProgress: true,
        }
        expect(getters.isRaceComplete(inProgress)).toBe(false)
      })

      it('returns false when rounds remaining', () => {
        expect(getters.isRaceComplete(mockState)).toBe(false)
      })
    })

    describe('roundDistances', () => {
      it('returns all round distances', () => {
        expect(getters.roundDistances()).toEqual(ROUND_DISTANCES)
      })
    })
  })

  describe('mutations', () => {
    let testState: RaceState

    beforeEach(() => {
      testState = state()
    })

    describe('SET_SCHEDULE', () => {
      it('sets the schedule', () => {
        const schedule: RaceRound[] = [
          { round: 1, distance: 1200, horses: createMockHorses(10) },
        ]
        mutations.SET_SCHEDULE(testState, schedule)
        expect(testState.schedule).toEqual(schedule)
      })
    })

    describe('SET_CURRENT_ROUND', () => {
      it('sets current round', () => {
        mutations.SET_CURRENT_ROUND(testState, 3)
        expect(testState.currentRound).toBe(3)
      })
    })

    describe('SET_RACE_IN_PROGRESS', () => {
      it('sets race in progress status', () => {
        mutations.SET_RACE_IN_PROGRESS(testState, true)
        expect(testState.isRaceInProgress).toBe(true)
      })
    })

    describe('SET_PAUSED', () => {
      it('sets paused status', () => {
        mutations.SET_PAUSED(testState, true)
        expect(testState.isPaused).toBe(true)
      })
    })

    describe('UPDATE_HORSE_POSITION', () => {
      it('updates horse position', () => {
        mutations.UPDATE_HORSE_POSITION(testState, { horseId: 1, position: 75 })
        expect(testState.horsePositions[1]).toBe(75)
      })
    })

    describe('RESET_POSITIONS', () => {
      it('clears all positions', () => {
        testState.horsePositions = { 1: 50, 2: 75 }
        mutations.RESET_POSITIONS(testState)
        expect(testState.horsePositions).toEqual({})
      })
    })

    describe('INIT_ROUND_POSITIONS', () => {
      it('initializes positions for horses at 0', () => {
        const horses = createMockHorses(3)
        mutations.INIT_ROUND_POSITIONS(testState, horses)

        expect(testState.horsePositions).toEqual({ 1: 0, 2: 0, 3: 0 })
      })
    })

    describe('SET_HORSE_SPEEDS', () => {
      it('sets horse speeds', () => {
        const speeds = { 1: 0.8, 2: 0.9 }
        mutations.SET_HORSE_SPEEDS(testState, speeds)
        expect(testState.horseSpeeds).toEqual(speeds)
      })
    })

    describe('SET_HORSE_FINISH_TIME', () => {
      it('sets horse finish time', () => {
        mutations.SET_HORSE_FINISH_TIME(testState, { horseId: 1, time: 12345 })
        expect(testState.horseFinishTimes[1]).toBe(12345)
      })
    })

    describe('RESET_FINISH_TIMES', () => {
      it('clears all finish times', () => {
        testState.horseFinishTimes = { 1: 100, 2: 200 }
        mutations.RESET_FINISH_TIMES(testState)
        expect(testState.horseFinishTimes).toEqual({})
      })
    })

    describe('ADD_ROUND_RESULTS', () => {
      it('adds round results', () => {
        const results = {
          round: 1,
          distance: 1200,
          results: [{ position: 1, horse: createMockHorses(1)[0] }],
        }
        mutations.ADD_ROUND_RESULTS(testState, results)
        expect(testState.results).toHaveLength(1)
        expect(testState.results[0]).toEqual(results)
      })
    })

    describe('CLEAR_RESULTS', () => {
      it('clears all results', () => {
        testState.results = [{ round: 1, distance: 1200, results: [] }]
        mutations.CLEAR_RESULTS(testState)
        expect(testState.results).toEqual([])
      })
    })

    describe('SET_ANIMATION_FRAME', () => {
      it('sets animation frame id', () => {
        mutations.SET_ANIMATION_FRAME(testState, 123)
        expect(testState.animationFrameId).toBe(123)
      })

      it('sets to null', () => {
        testState.animationFrameId = 123
        mutations.SET_ANIMATION_FRAME(testState, null)
        expect(testState.animationFrameId).toBeNull()
      })
    })

    describe('RESET_RACE', () => {
      it('resets all race state', () => {
        testState.schedule = [{ round: 1, distance: 1200, horses: [] }]
        testState.currentRound = 3
        testState.isRaceInProgress = true
        testState.isPaused = true
        testState.horsePositions = { 1: 50 }
        testState.horseSpeeds = { 1: 0.8 }
        testState.horseFinishTimes = { 1: 100 }
        testState.results = [{ round: 1, distance: 1200, results: [] }]
        testState.animationFrameId = 123

        mutations.RESET_RACE(testState)

        expect(testState.schedule).toEqual([])
        expect(testState.currentRound).toBe(0)
        expect(testState.isRaceInProgress).toBe(false)
        expect(testState.isPaused).toBe(false)
        expect(testState.horsePositions).toEqual({})
        expect(testState.horseSpeeds).toEqual({})
        expect(testState.horseFinishTimes).toEqual({})
        expect(testState.results).toEqual([])
        expect(testState.animationFrameId).toBeNull()
      })
    })
  })

  describe('actions', () => {
    describe('generateSchedule', () => {
      it('generates schedule with correct number of rounds', () => {
        const commit = vi.fn()
        const rootGetters = {
          'horse/allHorses': createMockHorses(20),
        }
        const context = { commit, rootGetters } as any

        const result = actions.generateSchedule(context)

        expect(result).toHaveLength(TOTAL_ROUNDS)
        expect(commit).toHaveBeenCalledWith('CLEAR_RESULTS')
        expect(commit).toHaveBeenCalledWith('SET_CURRENT_ROUND', 0)
        expect(commit).toHaveBeenCalledWith('RESET_POSITIONS')
        expect(commit).toHaveBeenCalledWith('SET_SCHEDULE', expect.any(Array))
      })

      it('each round has correct horses count', () => {
        const commit = vi.fn()
        const rootGetters = {
          'horse/allHorses': createMockHorses(20),
        }
        const context = { commit, rootGetters } as any

        const result = actions.generateSchedule(context)

        result?.forEach((round) => {
          expect(round.horses).toHaveLength(HORSES_PER_RACE)
        })
      })

      it('each round has correct distance', () => {
        const commit = vi.fn()
        const rootGetters = {
          'horse/allHorses': createMockHorses(20),
        }
        const context = { commit, rootGetters } as any

        const result = actions.generateSchedule(context)

        result?.forEach((round, index) => {
          expect(round.distance).toBe(ROUND_DISTANCES[index])
          expect(round.round).toBe(index + 1)
        })
      })

      it('returns null when not enough horses', () => {
        const commit = vi.fn()
        const rootGetters = {
          'horse/allHorses': createMockHorses(5),
        }
        const context = { commit, rootGetters } as any

        const result = actions.generateSchedule(context)

        expect(result).toBeNull()
      })
    })

    describe('pauseRace', () => {
      it('sets paused and cancels animation frame', () => {
        const commit = vi.fn()
        const cancelAnimationFrame = vi.fn()
        vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame)

        const mockState: RaceState = {
          ...state(),
          isRaceInProgress: true,
          isPaused: false,
          animationFrameId: 123,
        }
        const context = { commit, state: mockState } as any

        actions.pauseRace(context)

        expect(commit).toHaveBeenCalledWith('SET_PAUSED', true)
        expect(cancelAnimationFrame).toHaveBeenCalledWith(123)
        expect(commit).toHaveBeenCalledWith('SET_ANIMATION_FRAME', null)

        vi.unstubAllGlobals()
      })

      it('does nothing when not racing', () => {
        const commit = vi.fn()
        const mockState: RaceState = {
          ...state(),
          isRaceInProgress: false,
        }
        const context = { commit, state: mockState } as any

        actions.pauseRace(context)

        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('resetRace', () => {
      it('cancels animation and resets state', () => {
        const commit = vi.fn()
        const cancelAnimationFrame = vi.fn()
        vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame)

        const mockState: RaceState = {
          ...state(),
          animationFrameId: 123,
        }
        const context = { commit, state: mockState } as any

        actions.resetRace(context)

        expect(cancelAnimationFrame).toHaveBeenCalledWith(123)
        expect(commit).toHaveBeenCalledWith('RESET_RACE')

        vi.unstubAllGlobals()
      })
    })

    describe('toggleRace', () => {
      it('pauses when racing and not paused', () => {
        const dispatch = vi.fn()
        const mockState: RaceState = {
          ...state(),
          isRaceInProgress: true,
          isPaused: false,
        }
        const context = { dispatch, state: mockState } as any

        actions.toggleRace(context)

        expect(dispatch).toHaveBeenCalledWith('pauseRace')
      })

      it('starts when not racing', () => {
        const dispatch = vi.fn()
        const mockState: RaceState = {
          ...state(),
          isRaceInProgress: false,
          isPaused: false,
        }
        const context = { dispatch, state: mockState } as any

        actions.toggleRace(context)

        expect(dispatch).toHaveBeenCalledWith('startRace')
      })

      it('resumes when paused', () => {
        const dispatch = vi.fn()
        const mockState: RaceState = {
          ...state(),
          isRaceInProgress: true,
          isPaused: true,
        }
        const context = { dispatch, state: mockState } as any

        actions.toggleRace(context)

        expect(dispatch).toHaveBeenCalledWith('startRace')
      })
    })
  })
})
