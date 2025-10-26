<script setup lang="ts">
import { computed, provide, useTemplateRef, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { TreeNode as Node } from '@/composables/useComponentTree'

const props = withDefaults(
  defineProps<{
    disableRootDrop?: boolean
    size?: 'sm' | 'md' | 'lg'
    config: ReturnType<typeof import('@/composables/useComponentTree').useComponentTree>
  }>(),
  {
    disableRootDrop: false,
    size: 'md',
  },
)

const isDragOver = ref(false)
const items = computed(() => props.config.get(false) as Node[])

const treeContainer = useTemplateRef('tree')

onClickOutside(treeContainer, () => {
  props.config.unselectAll(false)
})

// provide values
provide('config', props.config)
provide('size', props.size)

const handleDrop = () => {
  props.config.handleDropEnd()
  isDragOver.value = false
}
</script>

<template>
  <div class="min-w-max space-y-1 overflow-x-auto" ref="tree">
    <TreeNode v-for="item in items" :key="item.id" :node="item" :level="0" />
  </div>
  <div
    v-if="!disableRootDrop"
    :class="{ 'bg-accented/50 dark:bg-muted/50': isDragOver }"
    class="flex-1 w-full h-full"
    @dragover.prevent
    @dragenter="isDragOver = true"
    @dragleave="isDragOver = false"
    @drop.prevent="handleDrop"
  ></div>
</template>
