<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'
import type { FolderType } from './EScreen.vue'

const props = defineProps<{
  type: FolderType
}>()

const selectedItem = ref<TreeItem>()
const items = ref<TreeItem[]>([
  {
    label: 'screens',
    defaultExpanded: true,
    children: [
      {
        label: 'composables/',
        children: [
          {
            label: 'useAuth.ts',
            icon: 'i-vscode-icons-file-type-typescript',
          },
        ],
      },
    ],
  },
  {
    label: 'components',
    defaultExpanded: true,
    children: [
      {
        label: 'Button.vue',
        icon: 'i-vscode-icons-file-type-vue',
      },
      {
        label: 'Header.vue',
        icon: 'i-vscode-icons-file-type-vue',
      },
    ],
  },
])

const filterItems = computed<TreeItem[]>(() => {
  if (props.type === 'screens') {
    return [items.value[0]] as TreeItem[]
  } else if (props.type === 'components') {
    return [items.value[1]] as TreeItem[]
  }
  return items.value as TreeItem[]
})

const onSelect = (e: TreeItemSelectEvent<TreeItem>) => {
  if (e.detail.originalEvent.type === 'click') {
    e.preventDefault()

    console.log('Selected item:', e.detail)
  }
}
</script>

<template>
  <UTree
    :items="filterItems"
    propagate-select
    bubble-select
    @select="onSelect"
    v-model="selectedItem"
  />
</template>
