export const TOTAL_HORSES = 20
export const HORSES_PER_RACE = 10
export const TOTAL_ROUNDS = 6

export const ROUND_DISTANCES: readonly number[] = [1200, 1400, 1600, 1800, 2000, 2200] as const

export const HORSE_COLORS: readonly string[] = [
  '#EF4444',
  '#3B82F6',
  '#FBBF24',
  '#22C55E',
  '#A855F7',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#6366F1',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F43F5E',
  '#10B981',
  '#0EA5E9',
  '#D946EF',
  '#78716C',
  '#FB923C',
  '#2DD4BF',
  '#C084FC',
] as const

export const COLOR_NAMES: Record<string, string> = {
  '#EF4444': 'Red',
  '#3B82F6': 'Blue',
  '#FBBF24': 'Yellow',
  '#22C55E': 'Green',
  '#A855F7': 'Purple',
  '#EC4899': 'Pink',
  '#F97316': 'Orange',
  '#14B8A6': 'Teal',
  '#6366F1': 'Indigo',
  '#8B5CF6': 'Violet',
  '#06B6D4': 'Cyan',
  '#84CC16': 'Lime',
  '#F43F5E': 'Rose',
  '#10B981': 'Emerald',
  '#0EA5E9': 'Sky',
  '#D946EF': 'Fuchsia',
  '#78716C': 'Stone',
  '#FB923C': 'Amber',
  '#2DD4BF': 'Aqua',
  '#C084FC': 'Orchid',
}

export const HORSE_NAMES: readonly string[] = [
  'Thunder Bolt',
  'Silver Arrow',
  'Golden Spirit',
  'Storm Chaser',
  'Midnight Star',
  'Wild Fire',
  'Ocean Breeze',
  'Shadow Runner',
  'Royal Flash',
  'Desert Wind',
  'Iron Will',
  'Lucky Charm',
  'Swift Justice',
  'Noble Heart',
  'Brave Warrior',
  'Dream Catcher',
  'Phoenix Rise',
  'Crystal Light',
  'Velvet Thunder',
  'Blazing Trail',
] as const

export const LANE_COLORS: readonly string[] = [
  '#DC2626',
  '#EA580C',
  '#D97706',
  '#CA8A04',
  '#65A30D',
  '#16A34A',
  '#059669',
  '#0D9488',
  '#0891B2',
  '#0284C7',
] as const

export const DEFAULT_HORSE_COLOR = '#1F2937'
export const DEFAULT_HORSE_SIZE = 60
export const TRACK_HORSE_SIZE = 40

export const CONDITION_MIN = 1
export const CONDITION_MAX = 100

export const CONDITION_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
} as const

export const MAX_RACE_DISTANCE = 2200

export const SPEED_FACTORS = {
  RANDOM_MIN: 0.8,
  RANDOM_MAX: 0.4,
  DISTANCE_DIVISOR: 200,
} as const

export const MAX_HORSE_POSITION = 95
export const FINISH_LINE_POSITION = 100
export const ROUND_DELAY_MS = 1500
export const FALLBACK_HORSE_SPEED = 0.5

export const FRAME_SPEED = {
  BASE: 0.5,
  RANDOM_RANGE: 0.3,
} as const

export const POSITION_STYLES = {
  FIRST: {
    row: 'bg-yellow-50',
    badge: 'bg-yellow-400 text-yellow-900',
  },
  SECOND: {
    row: 'bg-gray-50',
    badge: 'bg-gray-300 text-gray-700',
  },
  THIRD: {
    row: 'bg-orange-50',
    badge: 'bg-orange-400 text-orange-900',
  },
  DEFAULT: {
    row: '',
    badge: 'bg-gray-100 text-gray-600',
  },
} as const

export const ROUND_STATUS_STYLES = {
  COMPLETED: 'bg-green-100 text-green-800',
  CURRENT: 'bg-blue-100 text-blue-800',
  UPCOMING: 'bg-orange-100 text-orange-800',
} as const

export const UI_TEXT = {
  APP_TITLE: 'Horse Racing',
  GENERATE_PROGRAM: 'GENERATE PROGRAM',
  START: 'START',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  RACE_COMPLETE: 'RACE COMPLETE',
  RACING: 'Racing...',
  FINISH: 'FINISH',
  PROGRAM: 'Program',
  RESULTS: 'Results',
  HORSE_LIST: 'Horse List',
  EMPTY_PROGRAM: 'Click "Generate Program" to create a race schedule',
  EMPTY_RESULTS: 'Results will appear here after each race',
  EMPTY_TRACK: 'Generate a program to start racing!',
  POSITION: 'Position',
  NAME: 'Name',
  CONDITION: 'Condition',
  COLOR: 'Color',
} as const
