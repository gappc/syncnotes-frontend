<template>
  <div v-if="note != null" class="flex flex-1 flex-col gap-2 overflow-y-hidden">
    <div class="flex items-center gap-2">
      <ButtonCustom :to="{ name: 'home' }" class="flex items-center justify-between" size="xs">
        <IconArrowLeftS class="size-12" />
      </ButtonCustom>
      <input type="color" class="size-12" v-model="note.rgb" />
      <InputCustom
        v-model="note.title"
        class="w-full"
        placeholder="No title"
        :focus="isNewNote"
        :with-reset-button="true"
        :style="{ 'background-color': `${note.rgb}55` }"
        @input="note.updated = new Date().getTime()"
      />
    </div>

    <TextNote v-if="isTextNote(note)" class="flex-1" :textNote="note" :focus="!isNewNote" />
    <TodoNote v-if="isTodoNote(note)" class="flex-1" :todoNote="note" :focus="!isNewNote" />

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
import IconArrowLeftS from '@/components/svg/IconArrowLeftS.vue'
import { createUndoManager, store } from '@/modules/notes/store'
import { isNewNote as computeIsNewNote, isTextNote, isTodoNote } from '@/modules/notes/utils'
import { useRoute } from 'vue-router'

const route = useRoute()

const note = store.notes.find((note) => note.id === route.params.id)
const undoManager = note != null ? createUndoManager(note) : null

const isNewNote = computeIsNewNote(note)
</script>
