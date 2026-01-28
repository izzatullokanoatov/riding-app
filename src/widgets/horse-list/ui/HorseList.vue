<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { Horse } from '@/shared/types'
import { COLOR_NAMES, UI_TEXT } from '@/shared/config'
import { getConditionClass } from '@/shared/lib'

const store = useStore()

const horses = computed<Horse[]>(() => store.getters['horse/allHorses'])
const horseCount = computed<number>(() => store.getters['horse/horseCount'])

const getColorName = (color: string): string => {
  return COLOR_NAMES[color] || 'Unknown'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
    <div class="bg-yellow-400 px-4 py-3 flex-shrink-0">
      <h2 class="text-lg font-bold text-gray-800">
        {{ UI_TEXT.HORSE_LIST }} (1-{{ horseCount }})
      </h2>
    </div>

    <div class="overflow-y-auto overflow-x-hidden flex-1 bg-gray-50">
      <table class="w-full table-fixed">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="px-2 py-2 text-left text-sm font-semibold text-gray-600 truncate">{{ UI_TEXT.NAME }}</th>
            <th class="px-2 py-2 text-center text-sm font-semibold text-gray-600 w-16">{{ UI_TEXT.CONDITION }}</th>
            <th class="px-2 py-2 text-center text-sm font-semibold text-gray-600 w-20">{{ UI_TEXT.COLOR }}</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="horse in horses" :key="horse.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-2 py-2 text-sm text-gray-800 truncate">{{ horse.name }}</td>
            <td class="px-2 py-2 text-sm text-center">
              <span class="inline-flex items-center justify-center w-10 h-6 rounded font-medium text-xs" :class="getConditionClass(horse.condition)">
                {{ horse.condition }}
              </span>
            </td>
            <td class="px-2 py-2 text-center">
              <span class="inline-block w-full py-1 rounded text-xs font-medium text-white text-center truncate" :style="{ backgroundColor: horse.color }">
                {{ getColorName(horse.color) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
