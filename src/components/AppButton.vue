<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  }
})
</script>

<template>
  <button
    :type="props.type"
    class="text-sm font-semibold bg-text text-bg inline-flex px-2 py-1 rounded-lg"
  >
    <slot />
  </button>
</template>
