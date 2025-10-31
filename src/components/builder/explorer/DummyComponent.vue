<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useTree } from '@/composables/useTree'

const target = useTemplateRef('tree')

const node = useTree({
  variant: 'component',
  dragTarget: 'data-tree-id',
  dropTarget: 'data-tree-id',
  initialTree: [
    {
      id: 'title-text',
      type: 'folder',
      name: 'Text: Welcome Back!',
      icon: 'mdi:format-title',
    },
    {
      id: 'subtitle-text',
      type: 'folder',
      name: 'Text: Explore your dashboard',
      icon: 'mdi:subtitles-outline',
    },
  ],
})

onMounted(() => {
  node.start(target.value!)
})

onUnmounted(() => {
  node.stop(target.value!)
})
</script>

<template>
  {{ node.position }} - {{ node.isDropTarget('title-text') }}
  <div ref="tree">
    <div class="size-50 border" data-tree-id="title-text"></div>
    <div class="size-50 border" data-tree-id="subtitle-text"></div>
  </div>
</template>
