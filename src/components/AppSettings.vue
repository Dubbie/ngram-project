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
  <div>
    <div class="text-sm font-semibold mb-1">
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

    <div class="-mx-1.5 mb-6 bg-zinc-900 p-2 rounded-xl">
      <div class="flex items-center text-sm font-semibold px-2">
        <div class="flex items-center gap-x-3">
          <label class="block text-xs font-bold">Scope</label>
          <SelectInput
            :model-value="config.data[sourceName].scope"
            :options="scopes"
            @update:model-value="$emit('update-source-config', 'scope', $event)"
          />
        </div>
        <div class="w-px h-6 bg-white/30 mx-3"></div>
        <div class="flex items-center gap-x-3">
          <div class="flex items-center gap-x-3">
            <label class="block text-xs font-bold">Combinations</label>
            <TextInput
              :model-value="config.data[sourceName].combination"
              class="w-10 text-right"
              @update:model-value="$emit('update-source-config', 'combination', $event)"
            />
          </div>
          <div class="flex items-center gap-x-3">
            <label class="block text-xs font-bold">Repetitions</label>
            <TextInput
              :model-value="config.data[sourceName].repetition"
              class="w-10 text-right"
              @update:model-value="$emit('update-source-config', 'repetiton', $event)"
            />
          </div>
        </div>
        <div class="w-px h-6 bg-white/30 mx-3"></div>
        <div class="flex items-center gap-x-3">
          <div class="flex items-center gap-x-3">
            <label class="block text-xs font-bold">WPM</label>
            <TextInput
              :model-value="config.minWpm"
              class="w-10 text-right"
              @update:model-value="$emit('update-config', 'minWpm', $event)"
            />
          </div>
          <div class="flex items-center gap-x-3">
            <label class="block text-xs font-bold">Accuracy</label>
            <TextInput
              :model-value="config.minAccuracy"
              class="w-10 text-right"
              @update:model-value="$emit('update-config', 'minAccuracy', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
