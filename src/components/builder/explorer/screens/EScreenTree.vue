<script setup lang="ts">
import { useComponentTree } from '@/composables/useComponentTree'

defineProps<{
  type: 'screens' | 'components' | 'all'
}>()

const tree = useComponentTree({
  initialTree: [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      icon: 'flat-color-icons:folder',
      expandIcon: 'fluent-emoji-flat:open-file-folder',
      children: [
        { id: '2', name: 'App.vue', type: 'file', icon: 'streamline-ultimate-color:file-css' },
        {
          id: '3',
          name: 'components',
          icon: 'flat-color-icons:folder',
          expandIcon: 'fluent-emoji-flat:open-file-folder',
          type: 'folder',
          children: [
            {
              id: '4',
              name: 'Header.vue',
              type: 'file',
              icon: 'streamline-ultimate-color:file-css',
            },
          ],
        },
      ],
    },
    { id: '5', name: 'package.json', type: 'file', icon: 'streamline-ultimate-color:file-css' },
  ],
  variant: 'component',
  initialSorting: true,
})
</script>

<template>
  <TreeView :config="tree" size="md" />
</template>
