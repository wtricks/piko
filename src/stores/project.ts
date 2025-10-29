import { defineStore } from 'pinia'
import { useComponentTree } from '@/composables/useComponentTree'
import { HOME_SCREEN_COMPONENTS, PROJECT_SCREENS } from '@/components/data/project'
import { shallowRef } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const screenTree = useComponentTree({
    initialTree: PROJECT_SCREENS,
    variant: 'screen',
    initialSorting: true,
  })

  const componentTree = useComponentTree({
    initialTree: [HOME_SCREEN_COMPONENTS],
    variant: 'component',
    initialSorting: false,
  })

  const setType = (type: string) => {
    console.log('Set type', type)
  }

  return {
    screenTree: shallowRef(screenTree),
    componentTree: shallowRef(componentTree),
    setType,
  }
})
