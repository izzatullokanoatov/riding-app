import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  randomInt,
  generateCondition,
  shuffleArray,
  selectRandom,
  calculateHorseSpeed,
  getConditionClass,
  getOrdinalSuffix,
  formatRoundLabel,
} from '../index'
import { CONDITION_MIN, CONDITION_MAX } from '@/shared/config'

describe('shared/lib', () => {
  describe('randomInt', () => {
    it('returns a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
      }
    })

    it('returns the same number when min equals max', () => {
      expect(randomInt(5, 5)).toBe(5)
    })

    it('handles negative numbers', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(-10, -1)
        expect(result).toBeGreaterThanOrEqual(-10)
        expect(result).toBeLessThanOrEqual(-1)
      }
    })

    it('returns an integer', () => {
      for (let i = 0; i < 50; i++) {
        const result = randomInt(1, 100)
        expect(Number.isInteger(result)).toBe(true)
      }
    })
  })

  describe('generateCondition', () => {
    it('returns a condition within valid range', () => {
      for (let i = 0; i < 100; i++) {
        const condition = generateCondition()
        expect(condition).toBeGreaterThanOrEqual(CONDITION_MIN)
        expect(condition).toBeLessThanOrEqual(CONDITION_MAX)
      }
    })

    it('returns different values (randomness check)', () => {
      const conditions = new Set<number>()
      for (let i = 0; i < 50; i++) {
        conditions.add(generateCondition())
      }
      expect(conditions.size).toBeGreaterThan(1)
    })
  })

  describe('shuffleArray', () => {
    it('returns an array with the same length', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      expect(shuffled.length).toBe(original.length)
    })

    it('contains all original elements', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('does not mutate the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const copy = [...original]
      shuffleArray(original)
      expect(original).toEqual(copy)
    })

    it('handles empty array', () => {
      expect(shuffleArray([])).toEqual([])
    })

    it('handles single element array', () => {
      expect(shuffleArray([1])).toEqual([1])
    })

    it('works with different types', () => {
      const strings = ['a', 'b', 'c']
      const shuffled = shuffleArray(strings)
      expect(shuffled.sort()).toEqual(strings.sort())
    })
  })

  describe('selectRandom', () => {
    it('returns the correct number of elements', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const selected = selectRandom(array, 5)
      expect(selected.length).toBe(5)
    })

    it('returns all elements when count equals array length', () => {
      const array = [1, 2, 3]
      const selected = selectRandom(array, 3)
      expect(selected.sort()).toEqual(array.sort())
    })

    it('returns empty array when count is 0', () => {
      const array = [1, 2, 3]
      expect(selectRandom(array, 0)).toEqual([])
    })

    it('returns unique elements', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const selected = selectRandom(array, 5)
      const unique = new Set(selected)
      expect(unique.size).toBe(5)
    })

    it('does not mutate the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const copy = [...original]
      selectRandom(original, 3)
      expect(original).toEqual(copy)
    })
  })

  describe('calculateHorseSpeed', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('returns a positive number', () => {
      const speed = calculateHorseSpeed(50, 1200)
      expect(speed).toBeGreaterThan(0)
    })

    it('higher condition produces higher base speed', () => {
      const lowConditionSpeed = calculateHorseSpeed(20, 1200)
      const highConditionSpeed = calculateHorseSpeed(80, 1200)
      expect(highConditionSpeed).toBeGreaterThan(lowConditionSpeed)
    })

    it('longer distance affects speed calculation', () => {
      const shortDistanceSpeed = calculateHorseSpeed(50, 1200)
      const longDistanceSpeed = calculateHorseSpeed(50, 2200)
      expect(longDistanceSpeed).not.toBe(shortDistanceSpeed)
    })

    it('returns consistent results with mocked random', () => {
      const speed1 = calculateHorseSpeed(50, 1600)
      const speed2 = calculateHorseSpeed(50, 1600)
      expect(speed1).toBe(speed2)
    })
  })

  describe('getConditionClass', () => {
    it('returns excellent class for condition >= 80', () => {
      expect(getConditionClass(80)).toBe('bg-green-100 text-green-800')
      expect(getConditionClass(100)).toBe('bg-green-100 text-green-800')
      expect(getConditionClass(90)).toBe('bg-green-100 text-green-800')
    })

    it('returns good class for condition >= 60 and < 80', () => {
      expect(getConditionClass(60)).toBe('bg-yellow-100 text-yellow-800')
      expect(getConditionClass(79)).toBe('bg-yellow-100 text-yellow-800')
      expect(getConditionClass(70)).toBe('bg-yellow-100 text-yellow-800')
    })

    it('returns fair class for condition >= 40 and < 60', () => {
      expect(getConditionClass(40)).toBe('bg-orange-100 text-orange-800')
      expect(getConditionClass(59)).toBe('bg-orange-100 text-orange-800')
      expect(getConditionClass(50)).toBe('bg-orange-100 text-orange-800')
    })

    it('returns poor class for condition < 40', () => {
      expect(getConditionClass(39)).toBe('bg-red-100 text-red-800')
      expect(getConditionClass(1)).toBe('bg-red-100 text-red-800')
      expect(getConditionClass(20)).toBe('bg-red-100 text-red-800')
    })
  })

  describe('getOrdinalSuffix', () => {
    it('handles 1st, 2nd, 3rd correctly', () => {
      expect(getOrdinalSuffix(1)).toBe('1st')
      expect(getOrdinalSuffix(2)).toBe('2nd')
      expect(getOrdinalSuffix(3)).toBe('3rd')
    })

    it('handles 4th through 10th correctly', () => {
      expect(getOrdinalSuffix(4)).toBe('4th')
      expect(getOrdinalSuffix(5)).toBe('5th')
      expect(getOrdinalSuffix(10)).toBe('10th')
    })

    it('handles 11th, 12th, 13th correctly (special cases)', () => {
      expect(getOrdinalSuffix(11)).toBe('11th')
      expect(getOrdinalSuffix(12)).toBe('12th')
      expect(getOrdinalSuffix(13)).toBe('13th')
    })

    it('handles 21st, 22nd, 23rd correctly', () => {
      expect(getOrdinalSuffix(21)).toBe('21st')
      expect(getOrdinalSuffix(22)).toBe('22nd')
      expect(getOrdinalSuffix(23)).toBe('23rd')
    })

    it('handles larger numbers', () => {
      expect(getOrdinalSuffix(100)).toBe('100th')
      expect(getOrdinalSuffix(101)).toBe('101st')
      expect(getOrdinalSuffix(111)).toBe('111th')
      expect(getOrdinalSuffix(112)).toBe('112th')
    })
  })

  describe('formatRoundLabel', () => {
    it('formats round label correctly', () => {
      expect(formatRoundLabel(1, 1200)).toBe('1st Lap - 1200m')
      expect(formatRoundLabel(2, 1400)).toBe('2nd Lap - 1400m')
      expect(formatRoundLabel(3, 1600)).toBe('3rd Lap - 1600m')
      expect(formatRoundLabel(4, 1800)).toBe('4th Lap - 1800m')
      expect(formatRoundLabel(5, 2000)).toBe('5th Lap - 2000m')
      expect(formatRoundLabel(6, 2200)).toBe('6th Lap - 2200m')
    })
  })
})
