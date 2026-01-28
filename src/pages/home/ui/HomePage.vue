<script setup lang="ts">
import { AppHeader } from '@/widgets/header'
import { RaceTrack } from '@/widgets/race-track'
import { ProgramSchedule } from '@/widgets/program-schedule'
import { RaceResults } from '@/widgets/race-results'
import { HorseList } from '@/widgets/horse-list'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />

    <main class="max-w-[1800px] mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch max-h-[600px]">
        <div class="lg:col-span-1 h-full max-h-[700px]">
          <HorseList />
        </div>

        <div class="lg:col-span-2 h-full max-h-[700px]">
          <RaceTrack />
        </div>

        <div class="lg:col-span-1 h-full max-h-[700px]">
          <ProgramSchedule />
        </div>

        <div class="lg:col-span-1 h-full max-h-[700px]">
          <RaceResults />
        </div>
      </div>
    </main>
  </div>
</template>
