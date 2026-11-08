<template>
  <TextareaCustom v-model="note" :focus="focus" />
</template>

<script setup lang="ts">
import { updateNote } from '@/modules/notes/store'
import type { TextNote } from '@/modules/notes/types'
import { computed, type DeepReadonly } from 'vue'
import TextareaCustom from '../textarea/TextareaCustom.vue'

const props = withDefaults(defineProps<{ textNote: DeepReadonly<TextNote>; focus?: boolean }>(), {
  focus: false,
})

const note = computed({
  get: () => props.textNote.text,
  set: (text) => updateNote(props.textNote.id, { text: text ?? '' }),
})
</script>
