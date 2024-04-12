<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-show="props.show" class="fixed inset-0 z-10">
    <div class="absolute inset-0 bg-zinc-900 opacity-50 -z-10" @click="emit('close')"></div>

    <transition
      enter-active-class="transition transform ease-out duration-100"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      leave-active-class="transition transform ease-in duration-75"
      leave-to-class="opacity-0 scale-95"
      leave-from-class="opacity-100 scale-100"
    >
      <div
        class="max-w-lg mx-auto mt-10 flex items-center justify-center bg-zinc-900 text-white p-6 z-20 rounded-2xl"
        v-show="props.show"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>
