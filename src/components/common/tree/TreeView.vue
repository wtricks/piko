<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = withDefaults(
  defineProps<{
    disableRootDrop?: boolean
    size?: 'sm' | 'md' | 'lg'
    rootId?: string
    continueDrop?: boolean
    config: ReturnType<typeof import('@/composables/useTree').useTree>
  }>(),
  {
    disableRootDrop: false,
    size: 'md',
  },
)

const isOpen = ref(false)

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Open',
      icon: 'i-heroicons-folder-open',
      shortcut: 'Enter',
      onSelect: () => {
        window.alert('Open')
      },
    },
    { label: 'Rename', icon: 'i-heroicons-pencil-square', shortcut: 'F2' },
  ],
  [
    { label: 'Copy', icon: 'i-heroicons-document' },
    { label: 'Cut', icon: 'i-heroicons-scissors' },
    { label: 'Paste', icon: 'i-heroicons-clipboard' },
    { label: 'Duplicate', icon: 'i-heroicons-document-duplicate' },
  ],
  [
    {
      label: 'New',
      icon: 'i-heroicons-plus-circle',
      children: [
        { label: 'New Component', icon: 'i-heroicons-cube' },
        { label: 'New Folder', icon: 'i-heroicons-folder-plus' },
      ],
    },
    {
      label: 'Wrap with',
      icon: 'i-heroicons-rectangle-group',
      children: [
        { label: 'Section' },
        { label: 'Container' },
        { label: 'Card' },
        { label: 'Grid' },
      ],
    },
  ],
  [{ label: 'Delete', icon: 'i-heroicons-trash', shortcut: 'Del', color: 'error' }],
])

const treeContainer = useTemplateRef('tree')
const triggerRef = useTemplateRef('triggerRef')

const isDropTarget = computed(() => props.config.isDropTarget(props.rootId || 'root-node'))

onClickOutside(treeContainer, () => {
  props.config.unselectAll(false)
})

const onClick = (event: MouseEvent, rightClick = false) => {
  const el: HTMLElement | null = (event.target as HTMLElement)?.closest(
    rightClick ? '[data-tree-id]' : '[data-tree-menu]',
  ) as HTMLElement | null
  if (!el) return

  const id = el.dataset.treeId || el.dataset.treeMenu
  if (!id) return

  const rect = el.getBoundingClientRect()

  if (rightClick) {
    triggerRef.value!.style.left = `${event.clientX}px`
    triggerRef.value!.style.top = `${rect.top + rect.height / 2}px`
  } else {
    console.log(12345678)
    triggerRef.value!.style.left = `${rect.left + rect.width / 2}px`
    triggerRef.value!.style.top = `${rect.top + rect.height / 2}px`
  }

  isOpen.value = true
}

// provide values
provide('config', props.config)
provide('size', props.size)

onMounted(() => {
  props.config.start(treeContainer.value!, !!props.continueDrop)
})

onBeforeUnmount(() => {
  props.config.stop(treeContainer.value!)
})
</script>

<template>
  <div
    class="min-w-max space-y-1 overflow-x-auto flex-1 flex flex-col"
    ref="tree"
    @click="onClick"
    @contextmenu.prevent="onClick($event, true)"
  >
    <TreeNode v-for="item in config.tree" :key="item.id" :node="item" :level="0" />
    <div
      v-if="!disableRootDrop"
      :class="{ 'bg-accented/50 dark:bg-muted/50': isDropTarget }"
      class="flex-1 w-full"
      :data-tree-id="rootId || 'root-node'"
    ></div>
  </div>
  <Teleport to="body" v-if="config.isMoving.value">
    <div
      class="fixed left-0 top-0 size-6 bg-accented dark:bg-muted z-10 rounded-3xl border border-accented shadow-2xl flex items-center justify-center"
      :style="{ left: config.position.x - 24 + 'px', top: config.position.y - 24 + 'px' }"
    >
      {{ config.dragging.value.length }}
    </div>
  </Teleport>

  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-48',
    }"
    :content="{
      align: 'start',
      side: 'bottom',
    }"
    arrow
    v-model:open="isOpen"
  >
    <span class="fixed" :class="{ 'top-0 left-0': isOpen }" ref="triggerRef"></span>
  </UDropdownMenu>
</template>
