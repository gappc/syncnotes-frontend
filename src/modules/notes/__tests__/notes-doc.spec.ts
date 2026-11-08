import { describe, expect, it } from 'vitest'
import * as Y from 'yjs'
import {
  addNote,
  addTodo,
  deleteNote,
  findNoteMap,
  getNotesArray,
  moveNote,
  moveTodo,
  readNotes,
  removeTodo,
  updateNote,
  updateTodo,
} from '../notes-doc'
import type { TextNote, TodoNote } from '../types'
import { syncedStoreUpdateBase64 } from './syncedstore-update.fixture'

const fromSyncedStore = () => {
  const doc = new Y.Doc()
  Y.applyUpdate(doc, Buffer.from(syncedStoreUpdateBase64, 'base64'))
  return doc
}

// Describes which Yjs types hold which values, e.g. Y.Array[Y.Map{id: string, ...}]
const shape = (value: unknown): string => {
  if (value instanceof Y.Map) {
    const entries = [...value.keys()].sort().map((key) => `${key}: ${shape(value.get(key))}`)
    return `Y.Map{${entries.join(', ')}}`
  }
  if (value instanceof Y.Array) {
    return `Y.Array[${value.toArray().map(shape).join(', ')}]`
  }
  return typeof value
}

const textNote = (id: string, title = ''): TextNote => ({
  id,
  title,
  text: '',
  created: 1,
  updated: 1,
  rgb: '#000000',
})

const todoNote = (id: string): TodoNote => ({
  id,
  title: '',
  todos: [],
  created: 1,
  updated: 1,
  rgb: '#000000',
})

const ids = (doc: Y.Doc) => readNotes(doc).map((note) => note.id)

const todoTitles = (doc: Y.Doc, noteId: string) =>
  (readNotes(doc).find((note) => note.id === noteId) as TodoNote).todos.map((todo) => todo.title)

describe('compatibility with data written by SyncedStore', () => {
  it('reads notes written by SyncedStore', () => {
    expect(readNotes(fromSyncedStore())).toEqual([
      {
        id: 'text-1',
        title: 'Shopping',
        text: 'Milk\nBread',
        created: 1700000000000,
        updated: 1700000001000,
        rgb: '#ff0000',
      },
      {
        id: 'todo-1',
        title: 'Chores',
        todos: [
          { id: 't1', title: 'Dishes', completed: true },
          { id: 't2', title: 'Laundry', completed: false },
        ],
        created: 1700000002000,
        updated: 1700000003000,
        rgb: '#00ff00',
      },
    ])
  })

  it('writes the same Yjs structure as SyncedStore', () => {
    const doc = new Y.Doc()
    for (const note of readNotes(fromSyncedStore())) {
      addNote(doc, note)
    }

    expect(shape(getNotesArray(doc))).toBe(shape(getNotesArray(fromSyncedStore())))
  })

  it('edits notes written by SyncedStore', () => {
    const doc = fromSyncedStore()

    addTodo(doc, 'todo-1', 'Groceries', 'end')
    updateNote(doc, 'text-1', { text: 'Milk' })

    expect(todoTitles(doc, 'todo-1')).toEqual(['Dishes', 'Laundry', 'Groceries'])
    expect((readNotes(doc)[0] as TextNote).text).toBe('Milk')
  })
})

describe('notes', () => {
  it('adds, moves and deletes notes', () => {
    const doc = new Y.Doc()
    addNote(doc, textNote('a'))
    addNote(doc, textNote('b'))
    addNote(doc, todoNote('c'))

    // Same semantics as SortableJS: newIndex is the position after removal
    moveNote(doc, 0, 2)
    expect(ids(doc)).toEqual(['b', 'c', 'a'])

    expect(deleteNote(doc, 'c')).toBe(true)
    expect(deleteNote(doc, 'missing')).toBe(false)
    expect(ids(doc)).toEqual(['b', 'a'])
  })

  it('keeps nested todos when moving a note', () => {
    const doc = fromSyncedStore()
    moveNote(doc, 1, 0)

    expect(ids(doc)).toEqual(['todo-1', 'text-1'])
    expect(todoTitles(doc, 'todo-1')).toEqual(['Dishes', 'Laundry'])
  })

  it('updates fields and the updated timestamp', () => {
    const doc = new Y.Doc()
    addNote(doc, textNote('a'))

    updateNote(doc, 'a', { title: 'Title', text: 'Text', rgb: '#123456' })

    const [note] = readNotes(doc) as TextNote[]
    expect(note).toMatchObject({ title: 'Title', text: 'Text', rgb: '#123456' })
    expect(note!.updated).toBeGreaterThan(1)
  })

  it('finds the Yjs map of a note', () => {
    const doc = new Y.Doc()
    addNote(doc, textNote('a', 'First'))

    expect(findNoteMap(doc, 'a')?.get('title')).toBe('First')
    expect(findNoteMap(doc, 'missing')).toBeUndefined()
  })
})

describe('todos', () => {
  it('adds todos at the start or the end', () => {
    const doc = new Y.Doc()
    addNote(doc, todoNote('n'))

    addTodo(doc, 'n', 'second', 'end')
    addTodo(doc, 'n', 'first', 'start')
    addTodo(doc, 'n', 'third', 'end')

    expect(todoTitles(doc, 'n')).toEqual(['first', 'second', 'third'])
  })

  it('updates, moves and removes todos', () => {
    const doc = fromSyncedStore()

    updateTodo(doc, 'todo-1', 't2', { completed: true, title: 'Laundry!' })
    moveTodo(doc, 'todo-1', 1, 0)
    expect((readNotes(doc)[1] as TodoNote).todos).toEqual([
      { id: 't2', title: 'Laundry!', completed: true },
      { id: 't1', title: 'Dishes', completed: true },
    ])

    removeTodo(doc, 'todo-1', 't1')
    expect(todoTitles(doc, 'todo-1')).toEqual(['Laundry!'])
  })

  it('ignores todo operations on text notes', () => {
    const doc = fromSyncedStore()
    addTodo(doc, 'text-1', 'nope', 'end')

    expect(readNotes(doc)[0]).not.toHaveProperty('todos')
  })
})

describe('undo and sync', () => {
  it('undoes a move in one step', () => {
    const doc = new Y.Doc()
    addNote(doc, textNote('a'))
    addNote(doc, textNote('b'))
    const undoManager = new Y.UndoManager(getNotesArray(doc))

    moveNote(doc, 0, 1)
    expect(ids(doc)).toEqual(['b', 'a'])

    undoManager.undo()
    expect(ids(doc)).toEqual(['a', 'b'])
  })

  it('merges concurrent todo additions from two devices', () => {
    const phone = fromSyncedStore()
    const laptop = fromSyncedStore()

    addTodo(phone, 'todo-1', 'from phone', 'end')
    addTodo(laptop, 'todo-1', 'from laptop', 'end')
    Y.applyUpdate(phone, Y.encodeStateAsUpdate(laptop))
    Y.applyUpdate(laptop, Y.encodeStateAsUpdate(phone))

    expect(todoTitles(phone, 'todo-1')).toHaveLength(4)
    expect(todoTitles(phone, 'todo-1')).toEqual(todoTitles(laptop, 'todo-1'))
  })
})
