<script setup>
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

const emit = defineEmits(['change-source', 'update-config', 'update-source-config'])
</script>

<template>
  <div class="-mx-1.5 mb-6 bg-zinc-900 p-2 rounded-xl">
    <div class="flex items-center justify-center text-sm font-semibold px-2">
      <div class="flex items-center gap-x-3">
        <label class="block text-xs font-bold">Source</label>
        <SelectInput
          :model-value="config.data.source"
          :options="sources"
          @update:model-value="$emit('change-source', $event)"
        />
      </div>
      <div class="min-w-px h-6 bg-white/30 mx-3"></div>
      <div class="flex items-center gap-x-3">
        <label class="block text-xs font-bold">Scope</label>
        <SelectInput
          :model-value="config.data[sourceName].scope"
          :options="scopes"
          @update:model-value="$emit('update-source-config', 'scope', $event)"
        />
      </div>
      <div class="min-w-px h-6 bg-white/30 mx-3"></div>
      <div class="flex items-center gap-x-3">
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Combinations</label>
          <TextInput
            :model-value="config.data[sourceName].combination"
            class="w-9 text-right"
            @update:model-value="$emit('update-source-config', 'combination', $event)"
          />
        </div>
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Repetitions</label>
          <TextInput
            :model-value="config.data[sourceName].repetition"
            class="w-9 text-right"
            @update:model-value="$emit('update-source-config', 'repetiton', $event)"
          />
        </div>
      </div>
      <div class="min-w-px h-6 bg-white/30 mx-3"></div>
      <div class="flex items-center gap-x-3">
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">WPM</label>
          <TextInput
            :model-value="config.minWpm"
            class="w-9 text-right"
            @update:model-value="$emit('update-config', 'minWpm', $event)"
          />
        </div>
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Accuracy</label>
          <TextInput
            :model-value="config.minAccuracy"
            class="w-9 text-right"
            @update:model-value="$emit('update-config', 'minAccuracy', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
