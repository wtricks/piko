<script setup lang="ts">
import { computed, inject } from 'vue'
import type { TreeNode } from '@/composables/useComponentTree'

const config = inject('config')! as ReturnType<
  typeof import('@/composables/useComponentTree').useComponentTree
>
const size = inject('size')! as 'sm' | 'md' | 'lg' | undefined

const props = defineProps<{
  node: TreeNode
  level: number
}>()

const isExpandable = computed(() => config.isExpandable(props.node))
const isChildDropTarget = computed(() => config.isChildDropTarget(props.node))
const isDropTarget = computed(() => config.isDropTarget(props.node))
const isCollapsed = computed(() => config.isCollapsed(props.node.id))
const isSelected = computed(() => config.isSelected(props.node.id))

const icon = computed(() => {
  if (isCollapsed.value) {
    return props.node.icon || ''
  }

  return props.node.expandIcon || props.node.icon || ''
})
</script>

<template>
  <div class="transition-colors m-0 p-0">
    <div
      class="flex items-center cursor-pointer select-none gap-2 px-2 max-h-max group relative"
      :class="{
        'bg-primary/10 text-primary': isSelected,
        'hover:bg-accented/50 dark:hover:bg-muted/50': !isSelected,
        'py-0.5': size === 'sm',
        'py-1': size === 'md' || !size,
        'py-2': size === 'lg',
        'after:absolute after:left-0 after:bottom-0 after:h-full after:w-full':
          config.isDraggingNode.value,
        'before:absolute before:left-(--before-left) before:bottom-0 before:h-0.5 before:w-[calc(100%-var(--before-left))] before:bg-warning':
          isChildDropTarget && !isDropTarget,
        'before:absolute before:left-(--before-left) before:h-0.5 before:w-[calc(100%-var(--before-left))]':
          isDropTarget,
        'before:bg-primary before:bottom-0': isDropTarget && config.progress.value != 100,
        'before:bg-orange-500': isDropTarget && config.progress.value == 100,
        'before:bottom-0': isDropTarget && config.progress.value == 100 && !config.dropAbove.value,
        'before:top-0': isDropTarget && config.progress.value == 100 && config.dropAbove.value,
      }"
      :style="{
        paddingLeft: `${props.level * 16}px`,
        '--before-left': `${props.level * 16 + 8}px`,
      }"
      @click="config.select(node, $event)"
      @dblclick="config.toggle(node)"
      draggable="true"
      @dragstart="config.handleDragStart($event, node)"
      @dragend="config.endDrag()"
      @dragenter.prevent.stop="config.enterDropTarget(node)"
      @dragleave.prevent.stop="config.leaveDropTarget(node)"
      @dragover.prevent="config.dragOver"
      @drop.prevent="config.handleDropEnd(node)"
    >
      <UIcon
        v-if="isExpandable"
        name="i-heroicons-chevron-right-20-solid"
        class="transition-transform"
        :class="{
          'rotate-90': !isCollapsed,
          'size-3': size === 'sm',
          'size-4': size === 'md' || !size,
          'size-5': size === 'lg',
        }"
        @click.stop="config.toggle(node)"
      />
      <div
        v-else
        :class="{
          'size-3': size === 'sm',
          'size-4': size === 'md' || !size,
          'size-5': size === 'lg',
        }"
      ></div>

      <UIcon
        v-if="icon"
        :name="icon"
        :class="{
          'size-4': size === 'sm',
          'size-5': size === 'md' || !size,
          'size-6': size === 'lg',
        }"
      />

      <span
        class="truncate"
        :class="{
          'text-xs': size === 'sm',
          'text-sm': size === 'md' || !size,
          'text-base': size === 'lg',
        }"
        >{{ node.name }}</span
      >

      <UBadge v-if="isExpandable" color="neutral" size="xs" variant="subtle">
        {{ node.children?.length || 0 }}
      </UBadge>

      <svg
        v-if="isDropTarget && config.hasTimer"
        class="absolute right-2 top-1/2 -translate-y-1/2 size-4 -rotate-90"
        viewBox="0 0 36 36"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="currentColor"
          stroke-opacity="0.2"
          stroke-width="4"
          fill="none"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="100"
          :stroke-dashoffset="100 - config.progress.value"
          class="transition-all duration-75 hover:stroke-d"
          :class="{
            'text-primary': config.progress.value != 100,
            'text-orange-500': config.progress.value == 100,
          }"
        />
      </svg>

      <UButton
        v-else
        icon="solar:menu-dots-bold"
        variant="ghost"
        :size="size === 'sm' ? 'xs' : size === 'md' ? 'xs' : 'sm'"
        class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
        :color="isSelected || !isCollapsed ? 'primary' : 'neutral'"
        @click.stop
      />
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="!isCollapsed"
        class="relative before:absolute before:left-(--before-left) before:top-0 before:bottom-0 before:w-0.5"
        :style="{
          '--before-left': `${props.level * 16 + 8}px`,
        }"
        :class="{
          'before:bg-border': !isChildDropTarget,
          'before:bg-warning': isChildDropTarget,
        }"
      >
        <TreeNode v-for="child in node.children" :key="child.id" :node="child" :level="level + 1" />
      </div>
    </transition>
  </div>
</template>
