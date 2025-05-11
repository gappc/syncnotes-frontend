<template>
  <div class="flex gap-2">
    <InputCustom
      v-model="todoName"
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
import { ref } from 'vue'
import IconAdd from '../svg/IconAdd.vue'

const emit = defineEmits<{ (e: 'addTodo', todo: string): void }>()

withDefaults(defineProps<{ focus?: boolean }>(), { focus: false })

const todoName = ref('')

const emitTodo = () => {
  const value = todoName.value.trim()
  if (value.length === 0) {
    return
  }
  emit('addTodo', value)
  todoName.value = ''
}
</script>
