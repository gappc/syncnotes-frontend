<template>
  <div class="flex justify-center gap-2">
    <ButtonCustom @click="addTextNote">New TEXT note</ButtonCustom>
    <ButtonCustom @click="addTodoNote">New TODO note</ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import { store } from '@/modules/notes/store'
import { createTextNote, createTodoNote, isTextNote, isTodoNote } from '@/modules/notes/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const addTextNote = () => {
  const note = createTextNote()
  store.notes.push(note)
  // Return note from store
  const noteToEmit = store.notes.find((n) => note.id === n.id)
  if (!noteToEmit) {
    console.error(`Note with id ${note.id} not found in store`)
    return
  }
  if (!isTextNote(noteToEmit)) {
    console.error(`Note with id ${noteToEmit.id} is not a text note`)
    return
  }
  router.push(`/notes/${noteToEmit.id}`)
}

const addTodoNote = () => {
  const note = createTodoNote()
  store.notes.push(note)
  // Return note from store
  const noteToEmit = store.notes.find((n) => note.id === n.id)
  if (!noteToEmit) {
    console.error(`Note with id ${note.id} not found in store`)
    return
  }
  if (!isTodoNote(noteToEmit)) {
    console.error(`Note with id ${noteToEmit.id} is not a todo note`)
    return
  }
  router.push(`/notes/${noteToEmit.id}`)
}
</script>
