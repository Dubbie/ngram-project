<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  statistics: {
    type: Array,
    required: true
  }
})

const emitter = inject('emitter')

const averageWpm = computed(() => {
  return Math.round(
    props.statistics.reduce((acc, stat) => {
      return acc + stat.wpm
    }, 0) / props.statistics.length
  )
})

const averageAccuracy = computed(() => {
  return Math.round(
    props.statistics.reduce((acc, stat) => {
      return acc + stat.accuracy
    }, 0) / props.statistics.length
  )
})

const restarts = computed(() => {
  console.log(props.statistics)
  return props.statistics.reduce((acc, stat) => {
    return acc + stat.restarts
  }, 0)
})

const missedCharacters = computed(() => {
  return props.statistics.reduce((acc, stat) => {
    return acc + stat.missedCharacters
  }, 0)
})

const handleTab = (event) => {
  if (event.keyCode === 9) {
    event.preventDefault()
    emitter.emit('refresh-phrases')
  }
}

const emit = defineEmits(['refresh-phrases'])

onMounted(() => {
  window.addEventListener('keydown', handleTab)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleTab)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center font-mono mt-12">
    <p class="text-5xl mb-6">You did it!</p>

    <div class="flex gap-x-6 text-4xl">
      <p><span class="text-zinc-400 text-lg">wpm:</span> {{ averageWpm }}</p>
      <p><span class="text-zinc-400 text-lg">acc:</span> {{ averageAccuracy }}%</p>
      <p><span class="text-zinc-400 text-lg">restarts:</span> {{ restarts }}</p>
      <p><span class="text-zinc-400 text-lg">missed:</span> {{ missedCharacters }}</p>
    </div>

    <div class="flex gap-x-6 mt-12">
      <p @click="$emit('refresh-phrases')" class="text-zinc-400 cursor-pointer hover:text-white">
        Go again
      </p>
    </div>
  </div>
</template>
