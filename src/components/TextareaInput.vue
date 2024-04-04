<script setup>
import { ref, onMounted, watch } from 'vue'

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

const updateCaretPosition = () => {
  const lettersArray = lettersRef.value
  if (lettersArray.length < 1) {
    return
  }

  const typedPhraseWithoutSpaces = typedPhrase.value.replaceAll(' ', '')
  const lastIsSpace = typedPhrase.value[typedPhrase.value.length - 1] === ' '
  let letterElement = lettersArray[typedPhraseWithoutSpaces.length - 1]
  if (lastIsSpace) {
    letterElement = lettersArray[typedPhraseWithoutSpaces.length]
  }
  const letterRect = letterElement.getBoundingClientRect()
  const textContainterRect = textContainer.value.getBoundingClientRect()
  const left = letterRect.left - textContainterRect.left
  const top = letterRect.top - textContainterRect.top
  const moveCaretRight = lastIsSpace ? 0 : letterRect.width

  caret.value.style.left = left + moveCaretRight + 'px'
  caret.value.style.top = top + 'px'
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

const checkWords = () => {
  // dont enable double or more spaces
  typedPhrase.value = typedPhrase.value.replaceAll('  ', ' ')

  const typedWords = typedPhrase.value.split(' ')
  let newData = []

  for (let index = 0; index < expectedWords.value.length; index++) {
    const word = expectedWords.value[index]
    const actual = typedWords[index]

    if (!actual) {
      for (let j = 0; j < word.letters.length; j++) {
        word.letters[j].type = 'placeholder'
      }

      if (word.letters.length > word.word.length) {
        word.letters.splice(word.word.length, word.letters.length - word.word.length)
      }
      newData.push(word)

      continue
    }

    for (let j = 0; j < word.word.length; j++) {
      const letterData = word.letters[j]
      const expectedLetter = word.word[j]
      const actualLetter = actual[j]

      // check if letter is the same
      if (expectedLetter === actualLetter) {
        letterData.type = 'correct'
      } else if (!actualLetter) {
        letterData.type = 'placeholder'
      } else {
        letterData.type = 'incorrect'
      }
    }

    // check if length is greater, add missing letters
    if (actual.length > word.word.length) {
      for (let k = word.letters.length; k < actual.length; k++) {
        word.letters.push({
          letter: actual[k],
          type: 'extra-letter'
        })
      }
    }

    // Check if expected words letters are longer than the actual input
    if (word.letters.length > actual.length && word.letters.length > word.word.length) {
      word.letters.splice(actual.length, word.letters.length - actual.length)
    }

    newData.push(word)
  }

  // check if correct
  if (props.expectedPhrase === typedPhrase.value) {
    typedPhrase.value = ''
    emit('correct')
  }

  expectedWords.value = newData
  updateCaretPosition()
  blinking.value = false
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

const emit = defineEmits(['correct'])

onMounted(() => {
  expectedWords.value = getWordsFromPhrase()
  typedPhrase.value = ''
  updateCaretPosition()
})

watch(props, () => {
  expectedWords.value = getWordsFromPhrase()
  typedPhrase.value = ''
  updateCaretPosition()
})
</script>

<template>
  <div class="relative">
    <textarea
      class="text-black fixed top-0 opacity-0 pointer-events-none"
      v-model="typedPhrase"
      ref="textareaRef"
      @keyup="checkWords"
      @focus="handleShowCaret"
      @blur="handleHideCaret"
      rows="1"
    ></textarea>

    <div class="font-mono cursor-text" @click="focusTextarea">
      <div ref="textContainer" class="flex flex-wrap">
        <div v-for="(word, index) in expectedWords" :key="index" class="text-2xl m-1.5">
          <span
            v-for="letter in word.letters"
            ref="lettersRef"
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
