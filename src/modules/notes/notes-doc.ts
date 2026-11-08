/**
 * All reads and writes of notes in the Yjs document. No Vue in here.
 *
 * Data layout (unchanged from SyncedStore, so existing data keeps working):
 * Y.Array "notes" of Y.Map; todo notes keep their todos in a Y.Array of Y.Map.
 * Strings are plain values, not Y.Text.
 *
 * Every write runs in a single transaction, so one user action is one undo step.
 */
import * as Y from 'yjs'
import type { GenericNote, TextNote, Todo } from './types'
import { createTodo } from './utils'

type NoteMap = Y.Map<unknown>

export const getNotesArray = (doc: Y.Doc) => doc.getArray<NoteMap>('notes')

export const readNotes = (doc: Y.Doc) => getNotesArray(doc).toJSON() as GenericNote[]

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === 'object' && !Array.isArray(value)

// Convert plain data into Yjs types, the same way SyncedStore did
const toYjs = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const array = new Y.Array<unknown>()
    array.push(value.map(toYjs))
    return array
  }
  if (isPlainObject(value)) {
    return new Y.Map(Object.entries(value).map(([key, entry]) => [key, toYjs(entry)]))
  }
  return value
}

const indexOfNote = (doc: Y.Doc, id: string) =>
  getNotesArray(doc)
    .toArray()
    .findIndex((note) => note.get('id') === id)

export const findNoteMap = (doc: Y.Doc, id: string): NoteMap | undefined =>
  getNotesArray(doc)
    .toArray()
    .find((note) => note.get('id') === id)

const findTodos = (doc: Y.Doc, noteId: string) => {
  const todos = findNoteMap(doc, noteId)?.get('todos')
  return todos instanceof Y.Array ? (todos as Y.Array<Y.Map<unknown>>) : undefined
}

const touch = (note: NoteMap) => note.set('updated', Date.now())

// Yjs cannot move an item: delete it and insert a copy at the new position.
// newIndex is the position after removal (SortableJS semantics).
const moveItem = (array: Y.Array<Y.Map<unknown>>, oldIndex: number, newIndex: number) => {
  if (oldIndex === newIndex || oldIndex < 0 || oldIndex >= array.length) {
    return false
  }
  const copy = toYjs(array.get(oldIndex).toJSON()) as Y.Map<unknown>
  array.delete(oldIndex, 1)
  array.insert(Math.min(Math.max(newIndex, 0), array.length), [copy])
  return true
}

export const addNote = (doc: Y.Doc, note: GenericNote) => {
  getNotesArray(doc).push([toYjs(note) as NoteMap])
}

export const deleteNote = (doc: Y.Doc, id: string) => {
  const index = indexOfNote(doc, id)
  if (index === -1) {
    return false
  }
  getNotesArray(doc).delete(index, 1)
  return true
}

export const moveNote = (doc: Y.Doc, oldIndex: number, newIndex: number) => {
  doc.transact(() => moveItem(getNotesArray(doc), oldIndex, newIndex))
}

export type NoteChanges = Partial<Pick<TextNote, 'title' | 'text' | 'rgb'>>

export const updateNote = (doc: Y.Doc, id: string, changes: NoteChanges) => {
  const note = findNoteMap(doc, id)
  if (!note) {
    return
  }
  doc.transact(() => {
    for (const [key, value] of Object.entries(changes)) {
      note.set(key, value)
    }
    touch(note)
  })
}

export const addTodo = (doc: Y.Doc, noteId: string, title: string, where: 'start' | 'end') => {
  const todos = findTodos(doc, noteId)
  if (!todos) {
    return
  }
  doc.transact(() => {
    todos.insert(where === 'start' ? 0 : todos.length, [toYjs(createTodo(title)) as Y.Map<unknown>])
    touch(findNoteMap(doc, noteId)!)
  })
}

export const removeTodo = (doc: Y.Doc, noteId: string, todoId: string) => {
  const todos = findTodos(doc, noteId)
  const index = todos?.toArray().findIndex((todo) => todo.get('id') === todoId) ?? -1
  if (!todos || index === -1) {
    return
  }
  doc.transact(() => {
    todos.delete(index, 1)
    touch(findNoteMap(doc, noteId)!)
  })
}

export type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>

export const updateTodo = (doc: Y.Doc, noteId: string, todoId: string, changes: TodoChanges) => {
  const todo = findTodos(doc, noteId)
    ?.toArray()
    .find((entry) => entry.get('id') === todoId)
  if (!todo) {
    return
  }
  doc.transact(() => {
    for (const [key, value] of Object.entries(changes)) {
      todo.set(key, value)
    }
    touch(findNoteMap(doc, noteId)!)
  })
}

export const moveTodo = (doc: Y.Doc, noteId: string, oldIndex: number, newIndex: number) => {
  const todos = findTodos(doc, noteId)
  if (!todos) {
    return
  }
  doc.transact(() => {
    if (moveItem(todos, oldIndex, newIndex)) {
      touch(findNoteMap(doc, noteId)!)
    }
  })
}
