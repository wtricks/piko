import {
  BUILTIN_COMPONENTS,
  LIBRARY_COMPONENTS,
  PROJECT_COMPONENTS,
} from '@/components/data/e-component'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ComponentType = 'builtin' | 'project' | 'library'

export type LibraryType = {
  id: string
  name: string
  icon?: string
  image?: string
  description?: string
  items: ComponentGroup[]
}

export type ComponentItem = {
  id: string
  name: string
  icon?: string
  image?: string
  description?: string
}

export type ComponentGroup = {
  groupId: string
  groupName: string
  items: ComponentItem[]
}

export const useComponentStore = defineStore('component', () => {
  const components = ref<Record<ComponentType, LibraryType[] | ComponentGroup[]>>({
    builtin: BUILTIN_COMPONENTS,
    project: PROJECT_COMPONENTS,
    library: LIBRARY_COMPONENTS,
  })

  return {
    components,
  }
})
