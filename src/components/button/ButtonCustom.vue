<template>
  <button v-if="to == null" :class="classes" :disabled="disabled">
    <slot></slot>
  </button>
  <RouterLink v-else :to="to" :class="classes" :disabled="disabled"><slot></slot></RouterLink>
</template>

<script setup lang="ts">
import { useButtonClasses } from '@/components/button/styles'
import type { Size, Tone, Variant } from '@/components/button/types'
import { toRefs } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    size?: Size
    tone?: Tone
    variant?: Variant
    disabled?: boolean
  }>(),
  {
    to: undefined,
    size: 'md',
    tone: 'primary',
    variant: 'ghost',
    disabled: false,
  },
)

const { size, tone, variant, disabled } = toRefs(props)

const classes = useButtonClasses({ size, tone, variant, disabled })
</script>
