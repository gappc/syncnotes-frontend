<template>
  <div class="flex justify-center gap-2 text-lg">
    <ButtonCustom @click="add(addTextNote)" class="flex items-center gap-1">
      <IconAdd class="size-5" /> TEXT
    </ButtonCustom>
    <ButtonCustom @click="add(addTodoNote)" class="flex items-center gap-1">
      <IconAdd class="size-5" /> TODO
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import { addTextNote, addTodoNote } from '@/modules/notes/store'
import { useRouter } from 'vue-router'
import IconAdd from '../svg/IconAdd.vue'

const router = useRouter()

const add = (createNote: () => string) => router.push(`/notes/${createNote()}`)
</script>
