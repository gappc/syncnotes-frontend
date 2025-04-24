<template>
  <div v-if="note != null" class="flex flex-1 flex-col gap-2 overflow-y-hidden">
    <div class="flex gap-2">
      <ButtonCustom :to="{ name: 'home' }">Back</ButtonCustom>
      <InputCustom
        v-model="note.title"
        class="w-full"
        placeholder="No title"
        :focus="newNote"
        :with-reset-button="true"
        @input="note.updated = new Date().getTime()"
      />
    </div>

    <TextNote v-if="isTextNote(note)" class="flex-1" :textNote="note" :focus="!newNote" />
    <TodoNote v-if="isTodoNote(note)" class="flex-1" :todoNote="note" :focus="!newNote" />

    <UndoRedo v-if="undoManager != null" :undo-manager="undoManager" />
  </div>
  <div v-else class="flex flex-col gap-2">
    <ButtonCustom class="w-fit" :to="{ name: 'home' }">Back</ButtonCustom>
    <span>No note with ID {{ route.params.id }} found</span>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import InputCustom from '@/components/input/InputCustom.vue'
import TextNote from '@/components/note/TextNote.vue'
import TodoNote from '@/components/note/TodoNote.vue'
import UndoRedo from '@/components/note/UndoRedo.vue'
import { createUndoManager, store } from '@/modules/notes/store'
import { isNewNote, isTextNote, isTodoNote } from '@/modules/notes/utils'
import { useRoute } from 'vue-router'

const route = useRoute()

const note = store.notes.find((note) => note.id === route.params.id)
const undoManager = note != null ? createUndoManager(note) : null

const newNote = isNewNote(note)
</script>
