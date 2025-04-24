<template>
  <DebugOut class="flex flex-col">
    <div class="w-full">store.notes {{ store.notes }}</div>
  </DebugOut>
  <RouterView></RouterView>
</template>

<script setup lang="ts">
import { store } from '@/modules/notes/store'
import { RouterView } from 'vue-router'
import DebugOut from './components/debug/DebugOut.vue'
</script>
