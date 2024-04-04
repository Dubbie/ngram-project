<script setup>
import TextareaInput from './components/TextareaInput.vue'

const testPhrase = 'ou of ou of ou of'
</script>

<template>
  <div class="bg-zinc-800 text-white min-h-dvh py-20">
    <main class="max-w-xl mx-auto">
      <h1 class="text-xl font-semibold text-zinc-400 tracking-wide mb-6">Lesson 1/17</h1>

      <div>
        <TextareaInput :expected-phrase="testPhrase" />
      </div>
    </main>
  </div>
</template>
