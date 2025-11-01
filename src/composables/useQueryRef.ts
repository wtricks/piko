import { computed } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'

const query = useUrlSearchParams('history')

export function useQueryRef<T>(defaultValue: T, key: string, validateFn?: (value: T) => boolean) {
  return computed({
    get: () => {
      const value = query[key] as T
      return value && (!validateFn || validateFn(value)) ? value : defaultValue
    },
    set: (value: T) => {
      query[key] = value as string
    },
  })
}
