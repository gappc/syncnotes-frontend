<template>
  <TextareaCustom v-model="note" :focus="focus" />
</template>

<script setup lang="ts">
import type { TextNote } from '@/modules/notes/types'
import { computed, toRefs } from 'vue'
import TextareaCustom from '../textarea/TextareaCustom.vue'

const props = withDefaults(defineProps<{ textNote: TextNote; focus?: boolean }>(), {
  focus: false,
})

const { textNote } = toRefs(props)

const note = computed({
  get: () => props.textNote.text,
  set: (value) => {
    textNote.value.text = value
    textNote.value.updated = new Date().getTime()
  },
})
</script>
