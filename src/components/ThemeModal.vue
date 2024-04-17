<script setup>
import AppButton from './AppButton.vue'
import AppModal from './AppModal.vue'
import SelectInput from './SelectInput.vue'
import { themes } from '@/themes/all'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: themes.default
  }
})

const themeOptions = Object.keys(themes).map((theme) => {
  return {
    label: theme,
    value: theme
  }
})

const handleChange = (theme) => {
  emit('theme-changed', theme)
}

const emit = defineEmits(['close', 'theme-changed'])
</script>

<template>
  <AppModal :show="props.show" @close="emit('close')">
    <div>
      <p>Theme</p>
      <SelectInput
        :model-value="theme"
        :options="themeOptions"
        @update:model-value="handleChange"
      />
    </div>

    <div class="mt-6">
      <AppButton @click="emit('close')">Close</AppButton>
    </div>
  </AppModal>
</template>
