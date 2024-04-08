<script setup>
import AppKey from './AppKey.vue'

const props = defineProps({
  version: {
    type: String,
    required: true
  }
})
</script>

<template>
  <footer class="text-xs">
    <div class="flex justify-between">
      <div>
        <p>
          Thanks to
          <a href="https://github.com/ranelpadon/ngram-type" target="_blank" class="text-zinc-400"
            >ngram type</a
          >
          for the base of the code and
          <a href="https://monkeytype.com/" target="_blank" class="text-zinc-400">Monkeytype</a> for
          the inspiration
        </p>
        <p>
          You can find the source code on
          <a href="https://github.com/dubbie/ngram-project" target="_blank" class="text-zinc-400"
            >GitHub</a
          >
        </p>
      </div>
      <div>
        <p class="text-zinc-400">v{{ version }}</p>
      </div>
    </div>
  </footer>
</template>
