<template>
  <textarea
    v-model="model"
    ref="textareaElement"
    class="w-full rounded-md border border-white px-3 py-4 text-white focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600"
    :rows="rows"
    :placeholder="placeholder"
  ></textarea>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const model = defineModel<string>()

const props = withDefaults(
  defineProps<{ placeholder?: string; rows?: number; focus?: boolean }>(),
  {
    placeholder: 'What needs to be done?',
    rows: 5,
    focus: false,
  },
)

const textareaElement = ref<HTMLTextAreaElement | null>(null)

onMounted(() => {
  if (props.focus) {
    console.log('TextareaCustom: autofocus', textareaElement.value)

    textareaElement.value?.focus()
  }
})
</script>
