import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { state, getters, mutations, actions } from '../model'
import type { Horse, HorsesState } from '@/shared/types'
import { HORSE_NAMES, HORSE_COLORS, TOTAL_HORSES } from '@/shared/config'

describe('entities/horse/model', () => {
  describe('state', () => {
    it('returns initial state with empty horses array', () => {
      const initialState = state()
      expect(initialState.horses).toEqual([])
      expect(initialState.isGenerated).toBe(false)
    })

    it('returns a new state object each time', () => {
      const state1 = state()
      const state2 = state()
      expect(state1).not.toBe(state2)
    })
  })

  describe('getters', () => {
    const mockHorses: Horse[] = [
      { id: 1, name: 'Thunder Bolt', color: '#EF4444', condition: 85 },
      { id: 2, name: 'Silver Arrow', color: '#3B82F6', condition: 72 },
      { id: 3, name: 'Golden Spirit', color: '#FBBF24', condition: 45 },
    ]

    const mockState: HorsesState = {
      horses: mockHorses,
      isGenerated: true,
    }

    describe('allHorses', () => {
      it('returns all horses from state', () => {
        expect(getters.allHorses(mockState)).toEqual(mockHorses)
      })

      it('returns empty array when no horses', () => {
        const emptyState: HorsesState = { horses: [], isGenerated: false }
        expect(getters.allHorses(emptyState)).toEqual([])
      })
    })

    describe('getHorseById', () => {
      it('returns horse when found', () => {
        const getter = getters.getHorseById(mockState)
        expect(getter(1)).toEqual(mockHorses[0])
        expect(getter(2)).toEqual(mockHorses[1])
      })

      it('returns undefined when horse not found', () => {
        const getter = getters.getHorseById(mockState)
        expect(getter(999)).toBeUndefined()
      })
    })

    describe('isHorsesGenerated', () => {
      it('returns true when horses are generated', () => {
        expect(getters.isHorsesGenerated(mockState)).toBe(true)
      })

      it('returns false when horses are not generated', () => {
        const emptyState: HorsesState = { horses: [], isGenerated: false }
        expect(getters.isHorsesGenerated(emptyState)).toBe(false)
      })
    })

    describe('horseCount', () => {
      it('returns correct horse count', () => {
        expect(getters.horseCount(mockState)).toBe(3)
      })

      it('returns 0 for empty state', () => {
        const emptyState: HorsesState = { horses: [], isGenerated: false }
        expect(getters.horseCount(emptyState)).toBe(0)
      })
    })
  })

  describe('mutations', () => {
    let testState: HorsesState

    beforeEach(() => {
      testState = state()
    })

    describe('SET_HORSES', () => {
      it('sets horses and marks as generated', () => {
        const horses: Horse[] = [
          { id: 1, name: 'Test Horse', color: '#000000', condition: 50 },
        ]
        mutations.SET_HORSES(testState, horses)
        expect(testState.horses).toEqual(horses)
        expect(testState.isGenerated).toBe(true)
      })
    })

    describe('RESET_HORSES', () => {
      it('clears horses and resets generated flag', () => {
        testState.horses = [{ id: 1, name: 'Test', color: '#000', condition: 50 }]
        testState.isGenerated = true

        mutations.RESET_HORSES(testState)

        expect(testState.horses).toEqual([])
        expect(testState.isGenerated).toBe(false)
      })
    })

    describe('UPDATE_HORSE_CONDITION', () => {
      it('updates condition for existing horse', () => {
        testState.horses = [
          { id: 1, name: 'Test Horse', color: '#000', condition: 50 },
        ]

        mutations.UPDATE_HORSE_CONDITION(testState, { id: 1, condition: 75 })

        expect(testState.horses[0].condition).toBe(75)
      })

      it('does nothing when horse not found', () => {
        testState.horses = [
          { id: 1, name: 'Test Horse', color: '#000', condition: 50 },
        ]

        mutations.UPDATE_HORSE_CONDITION(testState, { id: 999, condition: 75 })

        expect(testState.horses[0].condition).toBe(50)
      })
    })
  })

  describe('actions', () => {
    describe('generateHorses', () => {
      it('generates horses and commits SET_HORSES', () => {
        const commit = vi.fn()
        const context = { commit } as any

        const result = actions.generateHorses(context)

        expect(commit).toHaveBeenCalledWith('SET_HORSES', expect.any(Array))
        expect(result).toHaveLength(TOTAL_HORSES)
      })

      it('generates horses with correct properties', () => {
        const commit = vi.fn()
        const context = { commit } as any

        const horses = actions.generateHorses(context)

        horses.forEach((horse, index) => {
          expect(horse.id).toBe(index + 1)
          expect(horse.name).toBe(HORSE_NAMES[index])
          expect(horse.color).toBe(HORSE_COLORS[index])
          expect(horse.condition).toBeGreaterThanOrEqual(1)
          expect(horse.condition).toBeLessThanOrEqual(100)
        })
      })
    })

    describe('resetHorses', () => {
      it('commits RESET_HORSES', () => {
        const commit = vi.fn()
        const context = { commit } as any

        actions.resetHorses(context)

        expect(commit).toHaveBeenCalledWith('RESET_HORSES')
      })
    })

    describe('regenerateConditions', () => {
      it('updates condition for all horses', () => {
        const commit = vi.fn()
        const mockState: HorsesState = {
          horses: [
            { id: 1, name: 'Horse 1', color: '#000', condition: 50 },
            { id: 2, name: 'Horse 2', color: '#111', condition: 60 },
          ],
          isGenerated: true,
        }
        const context = { commit, state: mockState } as any

        actions.regenerateConditions(context)

        expect(commit).toHaveBeenCalledTimes(2)
        expect(commit).toHaveBeenCalledWith(
          'UPDATE_HORSE_CONDITION',
          expect.objectContaining({ id: 1, condition: expect.any(Number) })
        )
        expect(commit).toHaveBeenCalledWith(
          'UPDATE_HORSE_CONDITION',
          expect.objectContaining({ id: 2, condition: expect.any(Number) })
        )
      })
    })
  })
})
