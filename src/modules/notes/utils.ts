import * as uuid from 'uuid'
import type { DeepReadonly } from 'vue'
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

type AnyNote = GenericNote | DeepReadonly<GenericNote>

export const isTextNote = <N extends AnyNote>(
  note: N | null | undefined,
): note is Extract<N, { text: string }> =>
  (note as { text?: unknown } | null | undefined)?.text !== undefined

export const isTodoNote = <N extends AnyNote>(
  note: N | null | undefined,
): note is Extract<N, { todos: unknown }> =>
  (note as { todos?: unknown } | null | undefined)?.todos !== undefined

export const isNewNote = (note: { created: number } | null | undefined) =>
  note == null || new Date().getTime() - note.created < 500
