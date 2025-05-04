export interface WithId {
  id: string
}

export interface WithTimestamp {
  created: number
  updated: number
}

export interface WithColor {
  rgb: string
}

export interface Note extends WithId, WithTimestamp, WithColor {
  title: string
}

export interface TextNote extends Note {
  text: string
}

export interface Todo extends WithId {
  completed: boolean
  title: string
}
export interface TodoNote extends Note {
  title: string
  todos: Todo[]
}

export type GenericNote = TextNote | TodoNote

export type StoreShape = {
  notes: GenericNote[]
}
