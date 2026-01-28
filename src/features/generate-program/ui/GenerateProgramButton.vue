<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { UI_TEXT } from '@/shared/config'
import { LoadingSpinner } from '@/shared/ui'

const store = useStore()
const isLoading = ref(false)

const isRacing = computed<boolean>(() => store.getters['race/isRacing'])
const isPaused = computed<boolean>(() => store.getters['race/isPaused'])

const isDisabled = computed<boolean>(() => {
  return isLoading.value || (isRacing.value && !isPaused.value)
})

const emit = defineEmits<{
  (e: 'generated'): void
  (e: 'error', message: string): void
}>()

const handleClick = async (): Promise<void> => {
  isLoading.value = true
  try {
    await store.dispatch('horse/generateHorses')
    const schedule = await store.dispatch('race/generateSchedule')
    if (schedule) {
      emit('generated')
    } else {
      emit('error', 'Failed to generate race program.')
    }
  } catch (e) {
    emit('error', 'An error occurred while generating the program.')
  } finally {
    isLoading.value = false
  }
}

defineExpose({ isLoading })
</script>

<template>
  <button
    class="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <LoadingSpinner v-if="isLoading" size="sm" />
    {{ UI_TEXT.GENERATE_PROGRAM }}
  </button>
</template>
