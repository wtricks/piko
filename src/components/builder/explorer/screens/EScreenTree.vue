<script setup lang="ts">
import { PROJECT_SCREENS } from '@/components/data/project'
import { useComponentTree } from '@/composables/useComponentTree'

defineProps<{
  type: 'screens' | 'components' | 'all'
}>()

const tree = useComponentTree({
  initialTree: PROJECT_SCREENS,
  variant: 'component',
  initialSorting: true,
})
</script>

<template>
  <TreeView :config="tree" size="md" />
</template>
