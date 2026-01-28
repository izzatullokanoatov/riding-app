<script setup lang="ts">
import { useStore } from 'vuex'
import { UI_TEXT } from '@/shared/config'
import { GenerateProgramButton } from '@/features/generate-program'
import { RaceControlButton } from '@/features/race-control'

const store = useStore()

const handleGenerated = (): void => {
  store.dispatch('notification/success', 'Race program generated successfully!')
}

const handleError = (message: string): void => {
  store.dispatch('notification/error', message)
}
</script>

<template>
  <header class="bg-red-400 shadow-lg">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">{{ UI_TEXT.APP_TITLE }}</h1>

      <nav class="flex gap-4">
        <GenerateProgramButton @generated="handleGenerated" @error="handleError" />
        <RaceControlButton />
      </nav>
    </div>
  </header>
</template>
