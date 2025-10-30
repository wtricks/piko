import { useUrlSearchParams } from '@vueuse/core'

const query = useUrlSearchParams('history')

export const useQueryParams = () => query
