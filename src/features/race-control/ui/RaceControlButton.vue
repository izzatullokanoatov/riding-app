<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { UI_TEXT, TOTAL_ROUNDS } from '@/shared/config'

const store = useStore()

const isRacing = computed<boolean>(() => store.getters['race/isRacing'])
const isPaused = computed<boolean>(() => store.getters['race/isPaused'])
const hasSchedule = computed<boolean>(() => store.getters['race/hasSchedule'])
const currentRound = computed<number>(() => store.state.race.currentRound)

const isRaceComplete = computed<boolean>(() => {
  return currentRound.value >= TOTAL_ROUNDS && !isRacing.value
})

const buttonText = computed<string>(() => {
  if (isRaceComplete.value) return UI_TEXT.RACE_COMPLETE
  if (isRacing.value && !isPaused.value) return UI_TEXT.PAUSE
  if (isPaused.value) return UI_TEXT.RESUME
  return UI_TEXT.START
})

const isDisabled = computed<boolean>(() => {
  return !hasSchedule.value || isRaceComplete.value
})

const buttonClasses = computed<string>(() => {
  if (isRaceComplete.value) return 'bg-gray-400 text-gray-700'
  if (isRacing.value && !isPaused.value) return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900'
  return 'bg-green-500 hover:bg-green-600 text-white'
})

const handleClick = (): void => {
  store.dispatch('race/toggleRace')
}
</script>

<template>
  <button
    class="px-6 py-2 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    :class="buttonClasses"
    :disabled="isDisabled"
    @click="handleClick"
  >
    {{ buttonText }}
  </button>
</template>
