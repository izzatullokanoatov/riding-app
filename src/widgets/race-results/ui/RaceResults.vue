<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RoundResults } from '@/shared/types'
import { POSITION_STYLES, UI_TEXT } from '@/shared/config'
import { formatRoundLabel } from '@/shared/lib'

const store = useStore()

const results = computed<RoundResults[]>(() => store.getters['race/allResults'])

const getPositionRowClass = (position: number): string => {
  if (position === 1) return POSITION_STYLES.FIRST.row
  if (position === 2) return POSITION_STYLES.SECOND.row
  if (position === 3) return POSITION_STYLES.THIRD.row
  return POSITION_STYLES.DEFAULT.row
}

const getPositionBadgeClass = (position: number): string => {
  if (position === 1) return POSITION_STYLES.FIRST.badge
  if (position === 2) return POSITION_STYLES.SECOND.badge
  if (position === 3) return POSITION_STYLES.THIRD.badge
  return POSITION_STYLES.DEFAULT.badge
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div class="bg-green-500 px-4 py-3 flex-shrink-0">
      <h2 class="text-lg font-bold text-white text-center">{{ UI_TEXT.RESULTS }}</h2>
    </div>

    <div class="overflow-y-auto flex-1 bg-gray-50">
      <div v-if="results.length === 0" class="p-8 text-center text-gray-500 h-full flex items-center justify-center">
        <p>{{ UI_TEXT.EMPTY_RESULTS }}</p>
      </div>

      <div v-else>
        <div v-for="roundResult in results" :key="roundResult.round" class="border-b border-gray-200 last:border-b-0">
          <div class="bg-orange-100 px-3 py-2 font-semibold text-sm text-orange-800">
            {{ formatRoundLabel(roundResult.round, roundResult.distance) }}
          </div>

          <table class="w-full text-sm bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-1 text-left text-xs font-medium text-gray-500">{{ UI_TEXT.POSITION }}</th>
                <th class="px-3 py-1 text-left text-xs font-medium text-gray-500">{{ UI_TEXT.NAME }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result in roundResult.results"
                :key="result.horse.id"
                class="border-t border-gray-100"
                :class="getPositionRowClass(result.position)"
              >
                <td class="px-3 py-1">
                  <span
                    class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                    :class="getPositionBadgeClass(result.position)"
                  >
                    {{ result.position }}
                  </span>
                </td>
                <td class="px-3 py-1">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: result.horse.color }"></span>
                    <span class="text-gray-800">{{ result.horse.name }}</span>
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
