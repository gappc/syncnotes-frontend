<template>
  <DebugOut v-if="isDev" class="flex flex-col">
    <div class="w-full">notes {{ notes }}</div>
  </DebugOut>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { notes } from '@/modules/notes/store'
import { RouterView } from 'vue-router'
import DebugOut from './components/debug/DebugOut.vue'

const isDev = import.meta.env.DEV
</script>
