<template>
  <div class="flex flex-col gap-4 overflow-y-hidden">
    <TodoNoteAdd :focus="focus" @addTodo="addTodo('start', $event)" />

    <ul class="todo-list-container flex flex-1 flex-col gap-3 overflow-y-auto">
      <li
        v-for="todo in todoNote.todos"
        :key="todo.id"
        class="flex items-center justify-between gap-2"
      >
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
        <ButtonCustom
          size="xs"
          class="flex items-center justify-center p-3"
          @click="removeTodo(todo.id)"
        >
          <IconDelete class="size-5" />
        </ButtonCustom>
      </li>
    </ul>

    <TodoNoteAdd @addTodo="addTodo('end', $event)" />
  </div>
</template>

<script setup lang="ts">
import InputCustom from '@/components/input/InputCustom.vue'
import { store } from '@/modules/notes/store'
import type { TodoNote } from '@/modules/notes/types'
import { createTodo, isTodoNote } from '@/modules/notes/utils'
import Sortable from 'sortablejs'
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import ButtonCustom from '../button/ButtonCustom.vue'
import IconCheckboxBlankCircle from '../svg/IconCheckboxBlankCircle.vue'
import IconCheckboxCircle from '../svg/IconCheckboxCircle.vue'
import IconDelete from '../svg/IconDelete.vue'
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

let sortable: Sortable | undefined

onMounted(() => {
  const todoListContainer = document.querySelector<HTMLUListElement>('.todo-list-container')
  if (todoListContainer) {
    sortable = Sortable.create(todoListContainer, {
      animation: 150,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      chosenClass: 'bg-emerald-600/50',
      onUpdate: ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex || oldIndex === undefined || newIndex === undefined) {
          return
        }

        // Copy element to avoid reference issues
        const element = JSON.parse(JSON.stringify(todoNote.value.todos[oldIndex]))
        // Remove the element from the old index
        todoNote.value.todos.splice(oldIndex, 1)
        // Insert the element copy at the new index
        todoNote.value.todos.splice(newIndex, 0, element)
        // Update todo list timestamp
        todoNote.value.updated = new Date().getTime()
      },
    })
  }
})

onUnmounted(() => {
  if (sortable) {
    sortable.destroy()
  }
})

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
</script>
