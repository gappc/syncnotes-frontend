import * as uuid from 'uuid'
import type { TodoNote, GenericNote, TextNote, Todo } from '@/modules/notes/types'

export const generateId = () => uuid.v4()

export const createTextNote = (title?: string, text?: string): TextNote => ({
  id: generateId(),
  title: title ?? '',
  text: text ?? '',
  created: new Date().getTime(),
  updated: new Date().getTime(),
  rgb: '#000000',
})

export const createTodoNote = (title?: string, todos?: Todo[]): TodoNote => ({
  id: generateId(),
  title: title ?? '',
  todos: todos ?? [],
  created: new Date().getTime(),
  updated: new Date().getTime(),
  rgb: '#000000',
})

export const createTodo = (title: string): Todo => ({
  id: generateId(),
  title,
  completed: false,
})

export const isTextNote = (note: GenericNote | null | undefined): note is TextNote =>
  (note as TextNote | null | undefined)?.text !== undefined

export const isTodoNote = (note: GenericNote | null | undefined): note is TodoNote =>
  (note as TodoNote | null | undefined)?.todos !== undefined

export const isNewNote = (note: GenericNote | null | undefined) =>
  note == null || new Date().getTime() - note.created < 500
