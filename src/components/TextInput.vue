<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  }
})
</script>

<template>
  <input
    type="text"
    class="bg-white/10 px-2 py-0.5 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30"
    :value="modelValue"
    @change="$emit('update:model-value', $event.originalTarget.value)"
  />
</template>
