<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RaceRound } from '@/shared/types'
import { ROUND_STATUS_STYLES, UI_TEXT } from '@/shared/config'
import { formatRoundLabel } from '@/shared/lib'

const store = useStore()

const schedule = computed<RaceRound[]>(() => store.getters['race/raceSchedule'])
const hasSchedule = computed<boolean>(() => store.getters['race/hasSchedule'])
const currentRoundNumber = computed<number>(() => store.getters['race/currentRoundNumber'])

const getRoundHeaderClass = (roundNumber: number): string => {
  if (roundNumber < currentRoundNumber.value) return ROUND_STATUS_STYLES.COMPLETED
  if (roundNumber === currentRoundNumber.value) return ROUND_STATUS_STYLES.CURRENT
  return ROUND_STATUS_STYLES.UPCOMING
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div class="bg-blue-500 px-4 py-3 flex-shrink-0">
      <h2 class="text-lg font-bold text-white text-center">{{ UI_TEXT.PROGRAM }}</h2>
    </div>

    <div class="overflow-y-auto flex-1 bg-gray-50">
      <div v-if="!hasSchedule" class="p-8 text-center text-gray-500 h-full flex items-center justify-center">
        <p>{{ UI_TEXT.EMPTY_PROGRAM }}</p>
      </div>

      <div v-else>
        <div v-for="round in schedule" :key="round.round" class="border-b border-gray-200 last:border-b-0">
          <div class="px-3 py-2 font-semibold text-sm" :class="getRoundHeaderClass(round.round)">
            {{ formatRoundLabel(round.round, round.distance) }}
          </div>

          <table class="w-full text-sm bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-1 text-left text-xs font-medium text-gray-500">{{ UI_TEXT.POSITION }}</th>
                <th class="px-3 py-1 text-left text-xs font-medium text-gray-500">{{ UI_TEXT.NAME }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, index) in round.horses" :key="horse.id" class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-3 py-1 text-gray-600">{{ index + 1 }}</td>
                <td class="px-3 py-1">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: horse.color }"></span>
                    <span class="text-gray-800">{{ horse.name }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
