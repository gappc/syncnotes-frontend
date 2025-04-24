import type { Size, Tone, Variant } from '@/components/button/types'
import { type MaybeRef, computed, toValue } from 'vue'

export const variantClass: Record<Variant, Record<Tone, string>> = {
  solid: {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600',
  },
  ghost: {
    primary:
      'bg-inherit text-white border hover:outline-2 hover:text-emerald-600 hover:-outline-offset-2 hover:outline-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600',
  },
}

export const sizeClass: Record<Size, string> = {
  xs: 'leading-tight',
  sm: 'pt-1.5 pb-1.5 px-6 leading-tight',
  md: 'py-3 px-5 leading-tight',
}

export const useButtonClasses = ({
  size = 'md',
  tone = 'primary',
  variant = 'solid',
  disabled = false,
}: {
  size: MaybeRef<Size>
  tone: MaybeRef<Tone>
  variant: MaybeRef<Variant>
  disabled: MaybeRef<boolean>
}) =>
  computed(() =>
    [
      // Base classes
      'inline-block rounded-md',
      // Handle variant and tone
      variantClass[toValue(variant)][toValue(tone)],
      // Handle size
      sizeClass[toValue(size)],
      // Handle disabled state
      toValue(disabled) ? ' opacity-50' : '',
    ].join(' '),
  )
