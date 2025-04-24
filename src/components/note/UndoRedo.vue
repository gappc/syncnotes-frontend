<template>
  <div class="flex gap-2">
    <ButtonCustom @click="undoManager.undo()">undo</ButtonCustom>
    <ButtonCustom @click="undoManager.redo()">redo</ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import type { UndoManager } from 'yjs'

defineProps<{ undoManager: UndoManager }>()
</script>
