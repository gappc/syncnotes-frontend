<template>
  <div class="flex flex-col gap-4 overflow-y-hidden">
    <TodoNoteAdd :focus="focus" @addTodo="addTodo('start', $event)" />

    <ul class="todo-list-container flex flex-1 flex-col gap-3 overflow-y-auto">
      <li
        v-for="todo in todoNote.todos"
        :key="todo.id"
        class="flex items-center justify-between gap-2"
      >
        <div class="handle flex items-center gap-2">
          <IconDragAndDrop class="size-8 cursor-pointer" />

          <button @click="updateTodo(todoNote.id, todo.id, { completed: !todo.completed })">
            <IconCheckboxCircle v-if="todo.completed" class="size-12 text-emerald-600" />
            <IconCheckboxBlankCircle v-else class="size-12" />
          </button>
        </div>

        <InputCustom
          :model-value="todo.title"
          class="grow"
          :class="{ 'line-through': todo.completed }"
          @update:model-value="updateTodo(todoNote.id, todo.id, { title: $event ?? '' })"
        />
        <ButtonCustom
          size="xs"
          class="flex items-center justify-center p-3"
          @click="removeTodo(todoNote.id, todo.id)"
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
import { addTodo as addTodoToNote, moveTodo, removeTodo, updateTodo } from '@/modules/notes/store'
import type { TodoNote } from '@/modules/notes/types'
import { useSortable } from '@/modules/notes/useSortable'
import type { DeepReadonly } from 'vue'
import ButtonCustom from '../button/ButtonCustom.vue'
import IconCheckboxBlankCircle from '../svg/IconCheckboxBlankCircle.vue'
import IconCheckboxCircle from '../svg/IconCheckboxCircle.vue'
import IconDelete from '../svg/IconDelete.vue'
import IconDragAndDrop from '../svg/IconDragAndDrop.vue'
import TodoNoteAdd from './TodoNoteAdd.vue'

const props = withDefaults(
  defineProps<{
    todoNote: DeepReadonly<TodoNote>
    focus?: boolean
  }>(),
  {
    focus: false,
  },
)

const addTodo = (where: 'start' | 'end', title: string) => {
  const value = title.trim()
  if (value.length === 0) {
    return
  }

  addTodoToNote(props.todoNote.id, value, where)

  setTimeout(() => {
    const todoListContainer = document.querySelector<HTMLUListElement>('.todo-list-container')
    todoListContainer?.scrollTo({
      top: where === 'start' ? 0 : todoListContainer.scrollHeight,
      behavior: 'smooth',
    })
  }, 100)
}

useSortable('.todo-list-container', ({ oldIndex, newIndex }) => {
  if (oldIndex === newIndex || oldIndex === undefined || newIndex === undefined) {
    return
  }

  moveTodo(props.todoNote.id, oldIndex, newIndex)
})
</script>
