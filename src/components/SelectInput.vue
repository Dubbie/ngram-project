<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false
  },
  options: {
    type: Array,
    required: true
  }
})

const selected = computed(() => {
  return props.options.find((opt) => opt.value === props.modelValue)
})

const label = computed(() => {
  return selected.value ? selected.value.label : 'Please choose...'
})
</script>

<template>
  <Listbox
    as="div"
    class="relative"
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <ListboxButton class="rounded-lg bg-white/10 px-2 py-0.5">{{ label }}</ListboxButton>
    <ListboxOptions
      class="absolute top-full z-10 left-0 bg-zinc-900/70 p-1 -mx-1 rounded-lg backdrop-blur-sm"
    >
      <ListboxOption
        v-for="opt in options"
        :key="opt"
        :value="opt.value"
        v-slot="{ active, selected }"
      >
        <div class="px-2 py-1 cursor-pointer" :class="active ? 'bg-zinc-800' : ''">
          {{ opt.label }}
        </div>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>
