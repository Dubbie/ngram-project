<script setup>
import BarSeparator from './BarSeparator.vue'
import InputLabel from './InputLabel.vue'
import SelectInput from './SelectInput.vue'
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
  },
  scopes: {
    type: Array,
    required: true
  }
})

const sourceName = computed(() => {
  return props.config.data.source
})

const emit = defineEmits([
  'change-source',
  'update-config',
  'update-source-config',
  'open-theme-settings'
])
</script>

<template>
  <div class="-mx-1.5 mb-6 bg-secondary p-2 rounded-xl">
    <div class="flex items-center justify-center text-sm font-semibold px-2">
      <div class="flex items-center gap-x-3">
        <InputLabel>Source</InputLabel>
        <SelectInput
          :model-value="config.data.source"
          :options="sources"
          @update:model-value="$emit('change-source', $event)"
        />
      </div>
      <BarSeparator />
      <div class="flex items-center gap-x-3">
        <InputLabel>Scope</InputLabel>
        <SelectInput
          :model-value="config.data[sourceName].scope"
          :options="scopes"
          @update:model-value="$emit('update-source-config', 'scope', $event)"
        />
      </div>
      <BarSeparator />
      <div class="flex items-center gap-x-3">
        <div class="flex items-center gap-x-3">
          <InputLabel>Combinations</InputLabel>
          <TextInput
            :model-value="config.data[sourceName].combination"
            class="w-9 text-center"
            @update:model-value="$emit('update-source-config', 'combination', $event)"
          />
        </div>
        <div class="flex items-center gap-x-3">
          <InputLabel>Reps</InputLabel>
          <TextInput
            :model-value="config.data[sourceName].repetition"
            class="w-9 text-center"
            @update:model-value="$emit('update-source-config', 'repetition', $event)"
          />
        </div>
      </div>
      <BarSeparator />
      <div class="flex items-center gap-x-3">
        <div class="flex items-center gap-x-3">
          <InputLabel>WPM</InputLabel>
          <TextInput
            :model-value="config.minWpm"
            class="w-9 text-center"
            @update:model-value="$emit('update-config', 'minWpm', $event)"
          />
        </div>
        <div class="flex items-center gap-x-3">
          <InputLabel>Accuracy</InputLabel>
          <TextInput
            :model-value="config.minAccuracy"
            class="w-9 text-center"
            @update:model-value="$emit('update-config', 'minAccuracy', $event)"
          />
        </div>
      </div>

      <div class="ml-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 cursor-pointer"
          @click="$emit('open-theme-settings')"
        >
          <path
            d="M15.993 1.385a1.87 1.87 0 0 1 2.623 2.622l-4.03 5.27a12.749 12.749 0 0 1-4.237 3.562 4.508 4.508 0 0 0-3.188-3.188 12.75 12.75 0 0 1 3.562-4.236l5.27-4.03ZM6 11a3 3 0 0 0-3 3 .5.5 0 0 1-.72.45.75.75 0 0 0-1.035.931A4.001 4.001 0 0 0 9 14.004V14a3.01 3.01 0 0 0-1.66-2.685A2.99 2.99 0 0 0 6 11Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
