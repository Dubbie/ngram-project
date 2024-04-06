<script setup>
import TextInput from './TextInput.vue'
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  sources: {
    type: Array,
    required: true
  }
})

const sourceName = computed(() => {
  return props.config.data.source
})

const emit = defineEmits(['change-source', 'update-config'])
</script>

<template>
  <div class="-mx-1.5 mb-6 bg-zinc-900 px-1 py-2 rounded-xl">
    <div class="flex text-sm font-semibold">
      <div>
        <p class="text-xs font-bold mb-2 pl-2">source</p>
        <div class="flex">
          <p
            v-for="source in sources"
            :key="source"
            class="cursor-pointer rounded-lg px-2 py-0.5"
            :class="{
              'text-white': config.data.source === source,
              'text-white/40 hover:bg-white/10 hover:text-white/70': config.data.source !== source
            }"
            @click="$emit('change-source', source)"
          >
            {{ source }}
          </p>
        </div>
      </div>
      <div class="w-px bg-white/30 mx-2"></div>
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Combinations</label>
          <TextInput
            :model-value="config.data[sourceName].combination"
            class="w-10 text-right"
            @update:model-value="$emit('update-config', 'combination', $event)"
          />
        </div>
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Repetitions</label>
          <TextInput
            :model-value="config.data[sourceName].repetition"
            class="w-10 text-right"
            @update:model-value="$emit('update-config', 'repetiton', $event)"
          />
        </div>
      </div>
      <div class="w-px bg-white/30 mx-2"></div>
    </div>
  </div>
</template>
