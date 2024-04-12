<script setup>
import AppFooter from './components/AppFooter.vue'
import AppSettings from './components/AppSettings.vue'
import NgramResults from './components/NgramResults.vue'
import TextareaInput from './components/TextareaInput.vue'
import AppKey from './components/AppKey.vue'
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue'
import AppLoading from './components/AppLoading.vue'
import ThemeModal from './components/ThemeModal.vue'
import { themes } from './themes/all'

const version = '0.1.0'
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

const showThemeModal = ref(false)
const currentTheme = ref({})
const emitter = inject('emitter')
const loading = ref(true)
const statistics = ref([])
const hideSettings = ref(false)
const finished = ref(false)
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
  minAccuracy: 100,
  theme: 'default'
})

provide('currentTheme', currentTheme)

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

  // save the generated data
  saveData()

  finished.value = false
}

const nextPhrase = () => {
  const _dataSource = dataSource.value
  const nextPhraseExists =
    dataSource.value.phrases.length > dataSource.value.phrasesCurrentIndex + 1
  if (nextPhraseExists) {
    _dataSource.phrasesCurrentIndex += 1
    config.value.expectedPhrase = _dataSource.phrases[_dataSource.phrasesCurrentIndex]
    config.value.data[config.value.data.source] = _dataSource

    // save the generated data
    saveData()
  } else {
    finished.value = true
    hideSettings.value = false
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
  statistics.value.push(statData)
}

const loadData = () => {
  loading.value = true

  // load config from localStorage
  let configData = localStorage.getItem('config')
  if (!configData) {
    localStorage.setItem('config', JSON.stringify(config.value))
  } else {
    // check for version compatibility
    configData = JSON.parse(configData)
    if (!configData.theme) {
      configData.theme = 'default'
    }
    config.value = configData
  }

  // load theme here
  loadTheme(config.value.theme)

  loading.value = false
}

const loadTheme = (theme) => {
  config.value.theme = theme
  currentTheme.value = themes[theme]
  saveData()
}

const saveData = () => {
  localStorage.setItem('config', JSON.stringify(config.value))
}

onMounted(() => {
  loadData()
  emitter.on('refresh-phrases', refreshPhrases)
})

onUnmounted(() => {
  emitter.off('refresh-phrases')
})
</script>

<template>
  <div class="wrapper font-mono" :style="currentTheme">
    <AppLoading v-if="loading" />

    <div v-else class="py-20 max-w-3xl mx-auto flex flex-col min-h-dvh">
      <main class="flex-1">
        <AppSettings
          :config="config"
          :sources="sourceOptions"
          :scopes="scopeOptions"
          class="transition duration-500 ease-in-out"
          :class="{ 'opacity-0': hideSettings }"
          @change-source="changeNgramSource"
          @update-source-config="handleSourceConfigUpdate"
          @update-config="handleConfigUpdate"
          @open-theme-settings="showThemeModal = true"
        />

        <div v-if="!finished">
          <div class="grid grid-cols-6 mx-1.5">
            <div class="col-span-4">
              <h1 class="text-xl font-semibold text-secondary tracking-wide mb-6">
                Lesson {{ dataSource.phrasesCurrentIndex + 1 }} / {{ dataSource.phrases.length }}
              </h1>
            </div>
            <div v-if="statistics.length > 0" class="text-sm font-semibold text-right">
              <p>
                <span class="text-secondary text-xs mr-2">Accuracy</span
                >{{ statistics[statistics.length - 1].accuracy }}%
              </p>
            </div>
            <div v-if="statistics.length > 0" class="text-sm font-semibold text-right">
              <p>
                <span class="text-secondary text-xs mr-2">WPM</span
                >{{ statistics[statistics.length - 1].wpm }}
              </p>
            </div>
          </div>

          <TextareaInput
            :expected-phrase="config.expectedPhrase"
            :min-accuracy="config.minAccuracy"
            :min-wpm="config.minWpm"
            @correct="nextPhrase"
            @update-statistics="handleStatistics"
            @started-typing="hideSettings = true"
            @blur="hideSettings = false"
          />
          <div class="mt-6 text-center text-xs opacity-50">
            <p><AppKey>Tab</AppKey> or <AppKey>Esc</AppKey> - reset phrase</p>
          </div>
        </div>

        <NgramResults v-else :statistics="statistics" @refresh-phrases="refreshPhrases" />
      </main>

      <AppFooter class="px-1.5" :version="version" />
    </div>

    <ThemeModal
      :show="showThemeModal"
      :theme="config.theme"
      @close="showThemeModal = false"
      @theme-changed="loadTheme"
    />
  </div>
</template>

<style>
.wrapper {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.text-primary {
  color: var(--text-color);
}

.bg-primary {
  background-color: var(--text-color);
}

.bg-secondary {
  background-color: var(--bg-color-secondary);
}

.text-bg {
  color: var(--bg-color);
}

.text-secondary {
  color: var(--text-color-secondary);
}
</style>
