<template>
  <div class="flex gap-2">
    <ButtonCustom @click="undoManager.undo()">
      <IconArrowGoBack class="size-5" />
    </ButtonCustom>
    <ButtonCustom @click="undoManager.redo()">
      <IconArrowGoForward class="size-5" />
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import type { UndoManager } from 'yjs'
import IconArrowGoBack from '../svg/IconArrowGoBack.vue'
import IconArrowGoForward from '../svg/IconArrowGoForward.vue'

defineProps<{ undoManager: UndoManager }>()
</script>
