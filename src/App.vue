<script setup>
import TextareaInput from './components/TextareaInput.vue'
import TextInput from './components/TextInput.vue'
import { computed, onMounted, ref } from 'vue'

const sourceOptions = ['bigrams', 'trigrams']

const config = ref({
  bigrams: bigrams,
  trigrams: trigrams,

  data: {
    source: 'bigrams',
    bigrams: {
      scope: 50,
      combination: 2,
      repetition: 3,
      phrases: [],
      phrasesCurrentIndex: 0
    },
    trigrams: {
      scope: 50,
      combination: 2,
      repetition: 3,
      phrases: [],
      phrasesCurrentIndex: 0
    }
  },

  phrases: [],
  expectedPhrase: '',
  minWpm: 40,
  minAccuracy: 100
})

const dataSource = computed(() => {
  return config.value.data[config.value.data.source]
})

const sourceName = computed(() => {
  return config.value.data.source
})

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const generatePhrases = (numberOfItemsToCombine, repetitions) => {
  const dataSource = config.value.data.source
  let source = config.value[dataSource]
  const scope = config.value.data[dataSource].scope

  if (scope) {
    source = source.slice(0, scope)
  }

  const ngrams = source.map((item) => {
    return item
  })

  shuffle(ngrams)
  let phrases = []

  while (ngrams.length) {
    let ngramsSublist = ngrams.slice(0, numberOfItemsToCombine)
    const subPhrase = ngramsSublist.join(' ')
    let _phrase = []
    for (var i = 0; i < repetitions; i++) {
      _phrase.push(subPhrase)
    }
    phrases.push(_phrase.join(' '))
    // Remove the processed ngrams.
    ngrams.splice(0, numberOfItemsToCombine)
  }

  return phrases
}

const refreshPhrases = () => {
  let _dataSource = dataSource.value

  console.log(_dataSource)

  if (_dataSource.combination < 1) {
    _dataSource.combination = 1
  }

  _dataSource.phrases = generatePhrases(_dataSource.combination, _dataSource.repetition)
  config.value.phrases = _dataSource.phrases
  config.value.expectedPhrase = _dataSource.phrases[0]
  _dataSource.phrasesCurrentIndex = 0

  config.value.data[config.value.data.source] = _dataSource
}

const nextPhrase = () => {
  const _dataSource = dataSource.value
  const nextPhraseExists =
    dataSource.value.phrases.length > dataSource.value.phrasesCurrentIndex + 1
  if (nextPhraseExists) {
    _dataSource.phrasesCurrentIndex += 1
    config.value.expectedPhrase = _dataSource.phrases[_dataSource.phrasesCurrentIndex]
    config.value.data[config.value.data.source] = _dataSource
  } else {
    refreshPhrases()
  }
}

const changeNgramSource = (newSource) => {
  config.value.data.source = newSource
  refreshPhrases()
}

const handleConfigUpdate = (key, newData) => {
  config.value.data[sourceName.value][key] = newData
  refreshPhrases()
}

onMounted(() => {
  refreshPhrases()
})
</script>

<template>
  <div class="bg-zinc-800 text-white min-h-dvh py-20">
    <main class="max-w-xl mx-auto">
      <div class="-mx-1.5 mb-6 bg-zinc-900 px-1 py-2 rounded-xl">
        <div class="flex text-sm font-semibold">
          <div>
            <p class="text-xs font-bold mb-2 pl-2">source</p>
            <div class="flex">
              <p
                v-for="source in sourceOptions"
                :key="source"
                class="cursor-pointer rounded-lg px-2 py-0.5"
                :class="{
                  'text-white': config.data.source === source,
                  'text-white/40 hover:bg-white/10 hover:text-white/70':
                    config.data.source !== source
                }"
                @click="changeNgramSource(source)"
              >
                {{ source }}
              </p>
            </div>
          </div>
          <div class="w-px bg-white/30 mx-2"></div>
          <div class="flex gap-x-3">
            <div>
              <label class="block text-xs font-bold mb-2">Combinations</label>
              <TextInput
                :model-value="config.data[sourceName].combination"
                class="w-10 text-right"
                @update:model-value="handleConfigUpdate('combination', $event)"
              />
            </div>
            <div>
              <label class="block text-xs font-bold mb-2">Repetitions</label>
              <TextInput
                :model-value="config.data[sourceName].repetition"
                class="w-10 text-right"
                @update:model-value="handleConfigUpdate('repetition', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <h1 class="text-xl font-semibold text-zinc-400 tracking-wide mb-6 mx-1.5">
        Lesson {{ dataSource.phrasesCurrentIndex + 1 }} / {{ dataSource.phrases.length }}
      </h1>

      <div>
        <TextareaInput :expected-phrase="config.expectedPhrase" @correct="nextPhrase" />
      </div>
    </main>
  </div>
</template>
