import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { enableVueBindings } from '@syncedstore/core'
import * as Vue from 'vue'
import App from './App.vue'
import router from './router'

enableVueBindings(Vue)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
