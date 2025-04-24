export interface WithId {
  id: string
}

export interface WithTimestamp {
  created: number
  updated: number
}

export interface Note extends WithId, WithTimestamp {
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
