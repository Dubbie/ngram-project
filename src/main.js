import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import mitt from 'mitt'

const emitter = mitt()

createApp(App).provide('emitter', emitter).mount('#app')
