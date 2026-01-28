<script setup lang="ts">
import { DEFAULT_HORSE_COLOR, DEFAULT_HORSE_SIZE } from '@/shared/config'

interface Props {
  color?: string
  size?: number | string
  isAnimated?: boolean
}

withDefaults(defineProps<Props>(), {
  color: DEFAULT_HORSE_COLOR,
  size: DEFAULT_HORSE_SIZE,
  isAnimated: false,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    :class="{ 'horse-gallop': isAnimated }"
  >
    <g :fill="color">
      <ellipse cx="50" cy="55" rx="25" ry="15" />
      <ellipse cx="78" cy="40" rx="10" ry="8" transform="rotate(-20, 78, 40)" />
      <polygon points="65,50 75,35 80,38 70,55" />
      <polygon points="82,32 85,25 88,33" />
      <rect x="58" y="65" width="5" height="20" rx="2" />
      <rect
        x="65"
        y="65"
        width="5"
        height="20"
        rx="2"
        :class="{ 'animate-leg-front': isAnimated }"
      />
      <rect x="30" y="65" width="5" height="20" rx="2" />
      <rect
        x="37"
        y="65"
        width="5"
        height="20"
        rx="2"
        :class="{ 'animate-leg-back': isAnimated }"
      />
      <path d="M 25 50 Q 10 45 15 60 Q 20 70 25 60" />
      <path d="M 70 42 Q 65 35 68 48 Q 62 38 65 50" />
    </g>
  </svg>
</template>

<style scoped>
@keyframes gallop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes legFront {
  0%, 100% { transform: rotate(0deg); transform-origin: 67px 65px; }
  50% { transform: rotate(-15deg); transform-origin: 67px 65px; }
}

@keyframes legBack {
  0%, 100% { transform: rotate(0deg); transform-origin: 39px 65px; }
  50% { transform: rotate(15deg); transform-origin: 39px 65px; }
}

.horse-gallop { animation: gallop 0.3s ease-in-out infinite; }
.animate-leg-front { animation: legFront 0.2s ease-in-out infinite; }
.animate-leg-back { animation: legBack 0.2s ease-in-out infinite; }
</style>
