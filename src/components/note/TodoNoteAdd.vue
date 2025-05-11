<template>
  <div class="flex gap-2">
    <InputCustom
      ref="todo-input"
      v-model="todoText"
      class="w-full"
      placeholder="What needs to be done?"
      :focus="focus"
      :with-reset-button="true"
      @keyup.enter="emitTodo"
    />
    <ButtonCustom @click="emitTodo" size="sm">
      <IconAdd class="size-5" />
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import InputCustom from '@/components/input/InputCustom.vue'
import { ref, useTemplateRef } from 'vue'
import IconAdd from '../svg/IconAdd.vue'

const emit = defineEmits<{ (e: 'addTodo', todo: string): void }>()

withDefaults(defineProps<{ focus?: boolean }>(), { focus: false })

const todoInput = useTemplateRef('todo-input')
const todoText = ref('')

const emitTodo = () => {
  const value = todoText.value.trim()
  if (value.length === 0) {
    return
  }
  emit('addTodo', value)

  todoText.value = ''
  todoInput.value?.focus()
}
</script>
