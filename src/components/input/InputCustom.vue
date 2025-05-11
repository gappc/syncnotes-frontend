<template>
  <div
    class="flex items-center gap-3 rounded-md border px-3 text-white focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600"
  >
    <slot name="prepend"></slot>
    <input
      ref="inputElement"
      v-model="model"
      class="w-full rounded py-2 focus-within:outline-none"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      @keyup.enter="emit('keyup.enter', $event)"
    />
    <ButtonCustom
      v-if="withResetButton"
      size="xs"
      class="border-0 p-1"
      :class="model?.length === 0 ? 'hidden' : ''"
      :disabled="model?.length === 0"
      @click="reset"
    >
      <IconClose class="h-6 w-6" />
    </ButtonCustom>
    <slot name="append"></slot>
  </div>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import IconClose from '@/components/svg/IconClose.vue'
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    autocomplete?: string
    focus?: boolean
    withResetButton?: boolean
  }>(),
  {
    type: 'text',
    placeholder: undefined,
    autocomplete: undefined,
    focus: undefined,
    withResetButton: false,
  },
)

const model = defineModel<string>()

const emit = defineEmits(['keyup.enter'])

const inputElement = ref<HTMLInputElement | null>(null)

const reset = () => {
  model.value = ''
  inputElement.value?.focus()
}

onMounted(() => {
  if (props.focus) {
    inputElement.value?.focus()
  }
})

defineExpose({
  focus: () => {
    inputElement.value?.focus()
  },
  blur: () => {
    inputElement.value?.blur()
  },
})
</script>
