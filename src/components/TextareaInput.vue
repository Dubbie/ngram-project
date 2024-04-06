<script setup>
import { ref, onMounted, watch, onUpdated } from 'vue'

const props = defineProps({
  expectedPhrase: {
    type: String,
    required: true
  }
})

const expectedWords = ref([])
const typedPhrase = ref('')
const textareaRef = ref(null)
const caret = ref(null)
const showCaret = ref(false)
const blinking = ref(false)
const textContainer = ref(null)
const lettersRef = ref([])
const wordsRef = ref([])
const activeWordIndex = ref(0)

const getPosition = (element) => {
  const rect = element.getBoundingClientRect()
  const parentRect = element.offsetParent.getBoundingClientRect()
  const offsetLeft = rect.left - parentRect.left
  const offsetTop = rect.top - parentRect.top

  return {
    left: offsetLeft,
    top: offsetTop
  }
}

const updateCaretPosition = () => {
  const inputLen = typedPhrase.value.length
  let currentLetterIndex = inputLen - 1
  if (currentLetterIndex == -1) {
    currentLetterIndex = 0
  }
  // count completed words letters
  for (let index = 0; index < activeWordIndex.value; index++) {
    currentLetterIndex += expectedWords.value[index].word.length
  }
  const letters = textContainer.value.querySelectorAll('.letter')
  const currentLetter = letters[currentLetterIndex]
  const currentLetterPos = getPosition(currentLetter)
  const letterHeight = currentLetter.clientHeight

  if (typedPhrase.value.length === 0) {
    caret.value.style.left = currentLetterPos.left - caret.value.clientWidth / 2 + 'px'
    caret.value.style.top = currentLetterPos.top + letterHeight / 4 + 'px'
  } else {
    caret.value.style.left =
      currentLetterPos.left +
      currentLetter.getBoundingClientRect().width -
      caret.value.clientWidth / 2 +
      'px'
    caret.value.style.top = currentLetterPos.top + letterHeight / 4 + 'px'
  }
}

const getWordsFromPhrase = () => {
  // iterate all letters, add them to the word, when space is found reset
  let words = []
  let word = []
  for (const letter of props.expectedPhrase) {
    if (letter === ' ') {
      words.push({
        word: word.map((letter) => letter.letter).join(''),
        letters: word
      })
      word = []
    } else {
      word.push({
        letter: letter,
        type: 'placeholder'
      })
    }
  }

  // add the remaining word
  words.push({
    word: word.map((letter) => letter.letter).join(''),
    letters: word
  })

  return words
}

const handleKeypress = (event) => {
  if (event.keyCode === 32) {
    event.preventDefault()
    handleSpace()
  }
}

const handleSpace = () => {
  const activeWord = expectedWords.value[activeWordIndex.value].word
  const typedSoFar = typedPhrase.value.trim()

  // check if word is the same as active word
  if (typedSoFar === activeWord) {
    // check if next word exists
    if (activeWordIndex.value < expectedWords.value.length - 1) {
      activeWordIndex.value += 1
      resetTypedPhrase()
    }
  }
}

const handleKeyup = () => {
  compareInput()
}

const compareInput = () => {
  const activeWordData = expectedWords.value[activeWordIndex.value]
  const activeWord = activeWordData.word

  // reset the letters inside the active word
  expectedWords.value[activeWordIndex.value].letters = []

  for (let index = 0; index < typedPhrase.value.length; index++) {
    const letter = typedPhrase.value[index]
    const expectedLetter = activeWord[index]

    if (letter === activeWord[index]) {
      addLetterData(letter, 'correct')
    } else {
      if (expectedLetter === undefined) {
        // extra letter
        addLetterData(letter, 'extra-letter')
      } else {
        // wrong letter
        addLetterData(activeWord[index], 'incorrect')
      }
    }
  }

  // add remaining letters not yet typed
  if (typedPhrase.value.length < activeWord.length) {
    for (let index = typedPhrase.value.length; index < activeWord.length; index++) {
      addLetterData(activeWord[index], 'placeholder')
    }
  }

  // check if all words are correct
  if (
    activeWordIndex.value === expectedWords.value.length - 1 &&
    typedPhrase.value === expectedWords.value[activeWordIndex.value].word
  ) {
    typedPhrase.value = ''
    emit('correct')
  }
}

const addLetterData = (letter, type) => {
  expectedWords.value[activeWordIndex.value].letters.push({
    letter: letter,
    type: type
  })
}

const focusTextarea = () => {
  textareaRef.value.focus()
}

const handleShowCaret = () => {
  showCaret.value = true
  blinking.value = true
}

const handleHideCaret = () => {
  showCaret.value = false
  blinking.value = true
}

const resetTypedPhrase = () => {
  typedPhrase.value = ''
}

const reset = () => {
  resetTypedPhrase()
  for (let index = 0; index <= activeWordIndex.value; index++) {
    expectedWords.value[index].letters = []
    for (let i = 0; i < expectedWords.value[index].word.length; i++) {
      const letter = expectedWords.value[index].word[i]

      expectedWords.value[index].letters.push({
        letter: letter,
        type: 'placeholder'
      })
    }
  }
  activeWordIndex.value = 0
}

const emit = defineEmits(['correct'])

onMounted(() => {
  expectedWords.value = getWordsFromPhrase()
  activeWordIndex.value = 0
  typedPhrase.value = ''
})

watch(props, () => {
  expectedWords.value = getWordsFromPhrase()
  typedPhrase.value = ''
  activeWordIndex.value = 0
})

onUpdated(() => {
  updateCaretPosition()
})
</script>

<template>
  <div class="relative">
    <textarea
      class="text-black fixed top-0 pointer-events-none opacity-0"
      ref="textareaRef"
      v-model="typedPhrase"
      @keyup="handleKeyup"
      @keypress="handleKeypress"
      @focus="handleShowCaret"
      @blur="handleHideCaret"
      @keydown.tab.prevent="reset"
      @keydown.esc.prevent="reset"
      rows="1"
    ></textarea>

    <div class="font-mono cursor-text" @click="focusTextarea">
      <div ref="textContainer" class="flex flex-wrap">
        <div
          v-for="(word, index) in expectedWords"
          :key="index"
          ref="wordsRef"
          class="text-2xl m-1.5"
        >
          <span
            v-for="letter in word.letters"
            ref="lettersRef"
            class="letter"
            :class="{
              'text-white': letter.type === 'correct',
              'text-white/30': letter.type === 'placeholder',
              'text-red-400': letter.type === 'incorrect',
              'text-red-600': letter.type === 'extra-letter'
            }"
            >{{ letter.letter }}</span
          >
        </div>
      </div>
    </div>

    <div
      ref="caret"
      class="absolute w-[2px] bg-white h-6 transition-all duration-100"
      :class="{
        'caret-blink': blinking
      }"
      v-show="showCaret"
    ></div>
  </div>
</template>

<style>
.caret-blink {
  animation: blink-caret 800ms infinite;
}

@keyframes blink-caret {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
