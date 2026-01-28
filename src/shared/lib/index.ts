import {
  CONDITION_MIN,
  CONDITION_MAX,
  CONDITION_THRESHOLDS,
  MAX_RACE_DISTANCE,
  SPEED_FACTORS,
} from '@/shared/config'

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateCondition = (): number => {
  return randomInt(CONDITION_MIN, CONDITION_MAX)
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const selectRandom = <T>(array: T[], count: number): T[] => {
  return shuffleArray(array).slice(0, count)
}

export const calculateHorseSpeed = (condition: number, distance: number): number => {
  const baseSpeed = condition / CONDITION_MAX
  const randomFactor = SPEED_FACTORS.RANDOM_MIN + Math.random() * SPEED_FACTORS.RANDOM_MAX
  const distanceFactor = 1 + (distance / MAX_RACE_DISTANCE) * (condition / SPEED_FACTORS.DISTANCE_DIVISOR)
  return baseSpeed * randomFactor * distanceFactor
}

export const getConditionClass = (condition: number): string => {
  if (condition >= CONDITION_THRESHOLDS.EXCELLENT) return 'bg-green-100 text-green-800'
  if (condition >= CONDITION_THRESHOLDS.GOOD) return 'bg-yellow-100 text-yellow-800'
  if (condition >= CONDITION_THRESHOLDS.FAIR) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

export const getOrdinalSuffix = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export const formatRoundLabel = (round: number, distance: number): string => {
  return `${getOrdinalSuffix(round)} Lap - ${distance}m`
}
