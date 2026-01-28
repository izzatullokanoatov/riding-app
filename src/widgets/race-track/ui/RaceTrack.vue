<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse, RaceRound, HorsePositions } from '@/shared/types'
import {
  LANE_COLORS,
  TRACK_HORSE_SIZE,
  MAX_HORSE_POSITION,
  FINISH_LINE_POSITION,
  UI_TEXT,
} from '@/shared/config'
import { formatRoundLabel } from '@/shared/lib'
import { HorseIcon } from '@/shared/ui'

const store = useStore()

const currentRoundData = computed<RaceRound | null>(() => store.getters['race/currentRoundData'])
const currentRoundNumber = computed<number>(() => store.getters['race/currentRoundNumber'])
const currentDistance = computed<number>(() => store.getters['race/currentDistance'])
const isRacing = computed<boolean>(() => store.getters['race/isRacing'])
const isPaused = computed<boolean>(() => store.getters['race/isPaused'])
const positions = computed<HorsePositions>(() => store.getters['race/positions'])

const currentHorses = computed<Horse[]>(() => {
  return currentRoundData.value?.horses || []
})

const getHorsePosition = (horseId: number): number => {
  const pos = positions.value[horseId]
  return Math.min(pos || 0, MAX_HORSE_POSITION)
}

const getLaneColor = (index: number): string => {
  return LANE_COLORS[index % LANE_COLORS.length]
}

const isHorseAnimated = (horseId: number): boolean => {
  return isRacing.value && !isPaused.value && getHorsePosition(horseId) < FINISH_LINE_POSITION
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div class="bg-gray-700 text-white px-4 py-2 flex justify-between items-center flex-shrink-0">
      <span class="font-semibold">
        {{ currentRoundData ? `Round ${currentRoundNumber} - ${currentDistance}m` : 'Race Track' }}
      </span>
      <span v-if="isRacing" class="flex items-center racing-indicator">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
        {{ UI_TEXT.RACING }}
      </span>
    </div>

    <div class="relative bg-green-800 p-4 flex-1 flex flex-col justify-center">
      <div class="absolute right-8 top-0 bottom-0 w-1 bg-white opacity-50 z-10">
        <span class="absolute -right-6 top-1/2 -translate-y-1/2 text-white text-xs font-bold rotate-90 whitespace-nowrap">
          {{ UI_TEXT.FINISH }}
        </span>
      </div>

      <div v-if="currentHorses.length > 0" class="space-y-1">
        <div v-for="(horse, index) in currentHorses" :key="horse.id" class="flex items-center">
          <div
            class="w-8 h-12 flex items-center justify-center text-white font-bold text-lg mr-2 rounded"
            :style="{ backgroundColor: getLaneColor(index) }"
          >
            {{ index + 1 }}
          </div>

          <div class="flex-1 relative h-12 bg-green-600 rounded border-t-2 border-b-2 border-dashed border-white/30">
            <div
              class="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear"
              :style="{ left: `${getHorsePosition(horse.id)}%`, transform: 'translateY(-50%) translateX(-50%)' }"
            >
              <HorseIcon :color="horse.color" :size="TRACK_HORSE_SIZE" :is-animated="isHorseAnimated(horse.id)" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex items-center justify-center h-64 text-white/70">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p class="text-lg">{{ UI_TEXT.EMPTY_TRACK }}</p>
        </div>
      </div>

      <div v-if="currentRoundData" class="mt-4 text-center">
        <span class="inline-block bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-bold text-sm">
          {{ formatRoundLabel(currentRoundNumber, currentDistance) }}
        </span>
      </div>
    </div>
  </div>
</template>
