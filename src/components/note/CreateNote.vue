<template>
  <div class="flex justify-center gap-2 text-lg">
    <ButtonCustom @click="addTextNote" class="flex items-center gap-1">
      <IconAdd class="size-5" /> TEXT
    </ButtonCustom>
    <ButtonCustom @click="addTodoNote" class="flex items-center gap-1">
      <IconAdd class="size-5" /> TODO
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import { store } from '@/modules/notes/store'
import { createTextNote, createTodoNote, isTextNote, isTodoNote } from '@/modules/notes/utils'
import { useRouter } from 'vue-router'
import IconAdd from '../svg/IconAdd.vue'

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
