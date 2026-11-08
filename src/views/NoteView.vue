<template>
  <div v-if="note != null" class="flex flex-1 flex-col gap-2 overflow-y-hidden">
    <div class="flex items-center gap-2">
      <ButtonCustom :to="{ name: 'home' }" class="flex items-center justify-between" size="xs">
        <IconArrowLeftS class="size-12" />
      </ButtonCustom>
      <input
        type="color"
        class="size-12"
        :value="note.rgb"
        @input="updateNote(note.id, { rgb: ($event.target as HTMLInputElement).value })"
      />
      <InputCustom
        :model-value="note.title"
        class="w-full"
        placeholder="No title"
        :focus="isNewNote"
        :with-reset-button="true"
        :style="{ 'background-color': `${note.rgb}55` }"
        @update:model-value="updateNote(note.id, { title: $event ?? '' })"
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
import { createNoteUndoManager, notes, updateNote } from '@/modules/notes/store'
import { isNewNote as computeIsNewNote, isTextNote, isTodoNote } from '@/modules/notes/utils'
import { computed, onUnmounted, shallowRef, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { UndoManager } from 'yjs'

const route = useRoute()
const noteId = route.params.id as string

// Reactive, so a note opened by URL shows up once the sync has loaded it
const note = computed(() => notes.value.find((note) => note.id === noteId))

const isNewNote = computed(() => computeIsNewNote(note.value))

const undoManager = shallowRef<UndoManager | null>(null)
watchEffect(() => {
  if (undoManager.value == null && note.value != null) {
    undoManager.value = createNoteUndoManager(noteId)
  }
})
onUnmounted(() => undoManager.value?.destroy())
</script>
