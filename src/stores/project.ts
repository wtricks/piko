import { defineStore } from 'pinia'
import { HOME_SCREEN_COMPONENTS, PROJECT_SCREENS } from '@/components/data/project'
import { shallowRef } from 'vue'
import { useTree } from '@/composables/useTree'

export const useProjectStore = defineStore('project', () => {
  const screenTree = useTree({
    initialTree: PROJECT_SCREENS,
    dropTarget: 'data-tree-id',
    dragTarget: 'data-tree-id',
    variant: 'screen',
    initialSorting: true,
    sorting: true,
  })

  const componentTree = useTree({
    initialTree: [HOME_SCREEN_COMPONENTS],
    dropTarget: 'data-tree-id',
    dragTarget: 'data-tree-id',
    variant: 'component',
    initialSorting: false,
    sorting: false,
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
