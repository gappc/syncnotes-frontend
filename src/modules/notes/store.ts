import { HocuspocusProvider } from '@hocuspocus/provider'
import { computed, shallowRef, type DeepReadonly } from 'vue'
import * as Y from 'yjs'
import * as notesDoc from './notes-doc'
import type { GenericNote } from './types'
import { createTextNote, createTodoNote } from './utils'

const doc = new Y.Doc()
const notesArray = notesDoc.getNotesArray(doc)

// Vue sees a plain, read-only snapshot of the notes. It is replaced on every
// change (local or remote); all writes go through the functions below.
const snapshot = shallowRef(notesDoc.readNotes(doc))
notesArray.observeDeep(() => {
  snapshot.value = notesDoc.readNotes(doc)
})

export const notes = computed(() => snapshot.value as DeepReadonly<GenericNote[]>)

export const undoManager = new Y.UndoManager(notesArray)

export const createNoteUndoManager = (id: string) => {
  const note = notesDoc.findNoteMap(doc, id)
  return note ? new Y.UndoManager(note) : null
}

export const addTextNote = () => {
  const note = createTextNote()
  notesDoc.addNote(doc, note)
  return note.id
}

export const addTodoNote = () => {
  const note = createTodoNote()
  notesDoc.addNote(doc, note)
  return note.id
}

export const deleteNote = (id: string) => notesDoc.deleteNote(doc, id)

export const moveNote = (oldIndex: number, newIndex: number) =>
  notesDoc.moveNote(doc, oldIndex, newIndex)

export const updateNote = (id: string, changes: notesDoc.NoteChanges) =>
  notesDoc.updateNote(doc, id, changes)

export const addTodo = (noteId: string, title: string, where: 'start' | 'end') =>
  notesDoc.addTodo(doc, noteId, title, where)

export const removeTodo = (noteId: string, todoId: string) =>
  notesDoc.removeTodo(doc, noteId, todoId)

export const updateTodo = (noteId: string, todoId: string, changes: notesDoc.TodoChanges) =>
  notesDoc.updateTodo(doc, noteId, todoId, changes)

export const moveTodo = (noteId: string, oldIndex: number, newIndex: number) =>
  notesDoc.moveTodo(doc, noteId, oldIndex, newIndex)

const documentName = 'syncnotes'

// Connect to the Hocuspocus sync server. The server ignores the URL path,
// but appending the document name keeps the same request path y-websocket
// used, so an existing reverse proxy config keeps working.
const wsProvider = new HocuspocusProvider({
  url: `${import.meta.env.VITE_WEBSOCKET_URL}/${documentName}`,
  name: documentName,
  document: doc,
})

wsProvider.on('status', (event: { status: string }) => {
  console.log(event.status)
})
