<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    disableRootDrop?: boolean
    size?: 'sm' | 'md' | 'lg'
    rootId?: string
    config: ReturnType<typeof import('@/composables/useTree').useTree>
  }>(),
  {
    disableRootDrop: false,
    size: 'md',
  },
)

const treeContainer = useTemplateRef('tree')

const isDropTarget = computed(() => props.config.isDropTarget(props.rootId || 'root-node'))

onClickOutside(treeContainer, () => {
  props.config.unselectAll(false)
})

// provide values
provide('config', props.config)
provide('size', props.size)

onMounted(() => {
  props.config.start(treeContainer.value!)
})

onUnmounted(() => {
  props.config.stop(treeContainer.value!)
})
</script>

<template>
  <div class="min-w-max space-y-1 overflow-x-auto flex-1 flex flex-col" ref="tree">
    <TreeNode v-for="item in config.tree" :key="item.id" :node="item" :level="0" />
    <div
      v-if="!disableRootDrop"
      :class="{ 'bg-accented/50 dark:bg-muted/50': isDropTarget }"
      class="flex-1 w-full"
      :data-tree-id="rootId || 'root-node'"
    ></div>
  </div>
  <Transition name="fade" mode="out-in">
    <Teleport to="body" v-if="config.isMoving.value">
      <div
        class="fixed left-0 top-0 size-6 bg-accented dark:bg-muted z-10 rounded-3xl border border-accented shadow-2xl flex items-center justify-center"
        :style="{ left: config.position.x - 24 + 'px', top: config.position.y - 24 + 'px' }"
      >
        {{ config.dragging.value.length }}
      </div>
    </Teleport>
  </Transition>
</template>
