<template>
  <main class="flex flex-1 flex-col overflow-y-hidden">
    <div class="flex flex-1 overflow-y-hidden">
      <ul v-if="store.notes.length > 0" class="flex flex-1 flex-col gap-2 overflow-y-auto">
        <li v-for="note in store.notes" :key="note.id" class="flex gap-2">
          <ButtonCustom
            :to="{ name: 'notes', params: { id: note.id } }"
            class="flex-1 wrap-anywhere"
            :style="{ 'background-color': `${note.rgb}55` }"
          >
            <div class="flex items-center gap-4">
              <IconTextSnippet v-if="isTextNote(note)" class="size-5" />
              <IconTaskLine v-else-if="isTodoNote(note)" class="size-5" />
              <span v-else>(?)</span>
              {{ getNoteTitle(note) }}
            </div>
          </ButtonCustom>
          <ButtonCustom
            size="xs"
            class="flex items-center justify-center p-3"
            @click="deleteNote(note.id)"
          >
            <IconDelete class="size-5" />
          </ButtonCustom>
        </li>
      </ul>
      <div v-else class="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-xl">
        <p class="text-center text-gray-500">No notes available</p>
        <p class="text-center text-gray-500">Create a new note to get started</p>
      </div>
    </div>

    <div class="flex items-center justify-between gap-2 pt-4">
      <UndoRedo :undoManager="undoManager" class="justify-center" />
      <CreateNote />
    </div>
  </main>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import CreateNote from '@/components/note/CreateNote.vue'
import UndoRedo from '@/components/note/UndoRedo.vue'
import IconDelete from '@/components/svg/IconDelete.vue'
import IconTaskLine from '@/components/svg/IconTaskLine.vue'
import IconTextSnippet from '@/components/svg/IconTextSnippet.vue'
import { store, undoManager } from '@/modules/notes/store'
import type { GenericNote } from '@/modules/notes/types'
import { isTextNote, isTodoNote } from '@/modules/notes/utils'

const getNoteTitle = (note: GenericNote) => {
  if (note.title == null || note.title.trim().length === 0) {
    return `(${new Intl.DateTimeFormat('de-DE').format(new Date(note.updated))})`
  }

  return note.title
}

const deleteNote = (id: string) => {
  console.log('deleteNote', id)
  const index = store.notes.findIndex((note) => note.id === id)
  if (index === -1) {
    return
  }

  store.notes.splice(index, 1)
}
</script>
