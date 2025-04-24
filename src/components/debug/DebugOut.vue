<template>
  <div class="text-sm">
    <button class="w-fit self-end" @click="hidden = !hidden">DEBUG</button>
    <pre v-if="!hidden" class="max-h-80 overflow-scroll pt-4"><slot></slot></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hidden = ref(true)
</script>
