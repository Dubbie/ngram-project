<script setup>
import AppSettings from './components/AppSettings.vue'
import TextareaInput from './components/TextareaInput.vue'
import { computed, onMounted, ref } from 'vue'

const sourceOptions = [
  {
    label: 'Bigrams',
    value: 'bigrams'
  },
  {
    label: 'Trigrams',
    value: 'trigrams'
  },
  {
    label: 'Tetragrams',
    value: 'tetragrams'
  },
  {
    label: 'Words',
    value: 'words'
  }
]

const scopeOptions = [
  {
    label: '50',
    value: 50
  },
  {
    label: '100',
    value: 100
  },
  {
    label: '150',
    value: 150
  },
  {
    label: '200',
    value: 200
  }
]

const statistics = ref(null)
const hideSettings = ref(false)
const config = ref({
  bigrams: bigrams,
  trigrams: trigrams,
  tetragrams: tetragrams,
  words: words,

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
    },
    tetragrams: {
      scope: 50,
      combination: 2,
      repetition: 3,
      phrases: [],
      phrasesCurrentIndex: 0
    },
    words: {
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

const handleSourceConfigUpdate = (key, newData) => {
  config.value.data[sourceName.value][key] = newData
  refreshPhrases()
}

const handleConfigUpdate = (key, newData) => {
  config.value[key] = newData
  refreshPhrases()
}

const handleStatistics = (statData) => {
  statistics.value = statData
}

onMounted(() => {
  refreshPhrases()
})
</script>

<template>
  <div class="bg-zinc-800 text-white min-h-dvh py-20">
    <main class="max-w-3xl mx-auto">
      <AppSettings
        :config="config"
        :sources="sourceOptions"
        :scopes="scopeOptions"
        @change-source="changeNgramSource"
        @update-source-config="handleSourceConfigUpdate"
        @update-config="handleConfigUpdate"
        class="transition duration-500 ease-in-out"
        :class="{ 'opacity-0': hideSettings }"
      />

      <div class="grid grid-cols-6">
        <div class="col-span-4">
          <h1 class="text-xl font-semibold text-zinc-400 tracking-wide mb-6 mx-1.5">
            Lesson {{ dataSource.phrasesCurrentIndex + 1 }} / {{ dataSource.phrases.length }}
          </h1>
        </div>
        <div v-if="statistics" class="text-sm font-semibold text-right">
          <p><span class="text-zinc-400 text-xs mr-2">Accuracy</span>{{ statistics.accuracy }}%</p>
        </div>
        <div v-if="statistics" class="text-sm font-semibold text-right">
          <p><span class="text-zinc-400 text-xs mr-2">WPM</span>{{ statistics.wpm }}</p>
        </div>
      </div>

      <div>
        <TextareaInput
          :expected-phrase="config.expectedPhrase"
          :min-accuracy="config.minAccuracy"
          :min-wpm="config.minWpm"
          @correct="nextPhrase"
          @update-statistics="handleStatistics"
          @started-typing="hideSettings = true"
          @blur="hideSettings = false"
        />
      </div>
    </main>
  </div>
</template>
