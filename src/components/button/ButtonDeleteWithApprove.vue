<template>
  <ButtonCustom size="xs" @click="statefulEmit">
    <IconDelete v-if="!showApproval" class="size-5" />
    <IconThumbUp v-else class="size-5 fill-red-500" />
  </ButtonCustom>
</template>

<script setup lang="ts">
import ButtonCustom from '@/components/button/ButtonCustom.vue'
import IconDelete from '@/components/svg/IconDelete.vue'
import IconThumbUp from '@/components/svg/IconThumbUp.vue'
import { ref } from 'vue'

const emit = defineEmits(['delete'])

const showApproval = ref(false)

const statefulEmit = async () => {
  if (!showApproval.value) {
    showApproval.value = true
    setTimeout(() => (showApproval.value = false), 3000)
  } else {
    showApproval.value = false
    emit('delete')
  }
}
</script>
