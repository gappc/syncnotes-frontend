<template>
  <div class="flex flex-col gap-4 overflow-y-hidden">
    <TodoNoteAdd :focus="focus" @addTodo="addTodo('start', $event)" />

    <VueDraggableNext
      v-if="isTodoNote(todoNote)"
      ref="todoListContainer"
      tag="ul"
      handle=".handle"
      class="todo-list-container flex flex-1 flex-col gap-3 overflow-y-auto"
      :list="[...todoNote.todos]"
      @change="changeTodoOrder"
    >
      <li
        v-for="todo in todoNote.todos"
        :key="todo.id"
        class="flex items-center justify-between gap-2"
      >
        <IconDragAndDrop class="handle size-8 cursor-pointer" />

        <button @click="todo.completed = !todo.completed">
          <IconCheckboxCircle v-if="todo.completed" class="size-12 text-emerald-600" />
          <IconCheckboxBlankCircle v-else class="size-12" />
        </button>

        <InputCustom
          v-model="todo.title"
          class="grow"
          :class="{ 'line-through': todo.completed }"
          @input="todoNote.updated = new Date().getTime()"
        />
        <ButtonDeleteWithApprove @delete="removeTodo(todo.id)" class="p-3" />
      </li>
    </VueDraggableNext>

    <TodoNoteAdd @addTodo="addTodo('end', $event)" />
  </div>
</template>

<script setup lang="ts">
import InputCustom from '@/components/input/InputCustom.vue'
import IconDragAndDrop from '@/components/svg/IconDragAndDrop.vue'
import { store } from '@/modules/notes/store'
import type { TodoNote } from '@/modules/notes/types'
import { createTodo, isTodoNote } from '@/modules/notes/utils'
import { ref, toRefs } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import ButtonDeleteWithApprove from '../button/ButtonDeleteWithApprove.vue'
import IconCheckboxBlankCircle from '../svg/IconCheckboxBlankCircle.vue'
import IconCheckboxCircle from '../svg/IconCheckboxCircle.vue'
import TodoNoteAdd from './TodoNoteAdd.vue'

const props = withDefaults(
  defineProps<{
    todoNote: TodoNote
    focus?: boolean
  }>(),
  {
    focus: false,
  },
)

const { todoNote } = toRefs(props)

const newTodo = ref('')

const findNote = (id: string) => store.notes.find((note) => note.id === id)

const addTodo = (where: 'start' | 'end', title: string) => {
  const value = title.trim()
  if (value.length === 0) {
    return
  }

  const note = findNote(todoNote.value.id)
  if (!isTodoNote(note)) {
    console.error(`Note with id ${todoNote.value.id} is not a todo note`)
    return
  }

  const todo = createTodo(value)
  if (where === 'start') {
    note.todos.unshift(todo)
  } else {
    note.todos.push(todo)
  }

  note.updated = new Date().getTime()

  newTodo.value = ''

  setTimeout(() => {
    const todoListContainer = document.querySelector<HTMLUListElement>('.todo-list-container')
    todoListContainer?.scrollTo({
      top: where === 'start' ? 0 : todoListContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, 100)
}

const removeTodo = (todoId: string) => {
  const note = findNote(todoNote.value.id)
  if (!isTodoNote(note)) {
    console.error(`Note with id ${todoNote.value.id} is not a todo note`)
    return
  }

  // Find the todo by id
  const index = note.todos.findIndex((todo) => todo.id === todoId)
  if (index === -1) {
    console.error(`Todo with id ${todoId} not found`)
    return
  }

  note.todos.splice(index, 1)

  note.updated = new Date().getTime()
}

const changeTodoOrder = ({
  moved: { newIndex, oldIndex },
}: {
  moved: { newIndex: number; oldIndex: number; element: unknown }
}) => {
  console.log(`changeTodoOrder: ${oldIndex} -> ${newIndex}`)
  const note = findNote(todoNote.value.id)
  if (!isTodoNote(note)) {
    console.error(`Note with id ${todoNote.value.id} is not a todo note`)
    return
  }

  const tmpOldTodo = JSON.parse(JSON.stringify(note.todos[oldIndex]))
  const tmpNewTodo = JSON.parse(JSON.stringify(note.todos[newIndex]))

  note.todos.splice(newIndex, 1, tmpOldTodo)
  note.todos.splice(oldIndex, 1, tmpNewTodo)

  note.updated = new Date().getTime()
}
</script>
