<script setup>
import TextareaInput from './components/TextareaInput.vue'
import { computed, onMounted, ref } from 'vue'

const config = ref({
  bigrams: bigrams,

  data: {
    source: 'bigrams',
    bigrams: {
      scope: 50,
      combination: 2,
      repetition: 3,
      phrases: [],
      phrasesCurrentIndex: 0
    }
  },

  phrases: [],
  expectedPhrase: ''
})

const dataSource = computed(() => {
  return config.value.data[config.value.data.source]
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

onMounted(() => {
  refreshPhrases()
})
</script>

<template>
  <div class="bg-zinc-800 text-white min-h-dvh py-20">
    <main class="max-w-xl mx-auto">
      <h1 class="text-xl font-semibold text-zinc-400 tracking-wide mb-6 mx-1.5">
        Lesson {{ dataSource.phrasesCurrentIndex + 1 }} / {{ dataSource.phrases.length }}
      </h1>

      <div>
        <TextareaInput :expected-phrase="config.expectedPhrase" @correct="nextPhrase" />
      </div>
    </main>
  </div>
</template>
