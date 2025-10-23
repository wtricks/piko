<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { TabsItem } from '@nuxt/ui'
import EScreenTree from './EScreenTree.vue'
import { useShortcut } from '@/composables/useShortcut'

export type FolderType = 'all' | 'screens' | 'components'

const container = ref<HTMLDivElement>()

const topHeight = ref(200)
const isDragging = ref(false)
const componentModal = ref(false)

const activeTab = ref<FolderType>('all')

const inputRef = useTemplateRef('input')

const tabsItems: TabsItem[] = [
  {
    label: '',
    value: 'all',
    tooltip: 'Screens & Components',
    icon: 'mage:folder-2',
  },
  {
    label: '',
    value: 'screens',
    tooltip: 'Screens',
    icon: 'i-iconoir-multiple-pages',
  },
  {
    label: '',
    value: 'components',
    tooltip: 'Components',
    icon: 'tdesign:component-radio',
  },
]

useEventListener(window, 'mousemove', (e: MouseEvent) => {
  if (!isDragging.value) return
  const newHeight = topHeight.value + e.movementY
  topHeight.value = Math.max(0, Math.min(container.value!.offsetHeight, newHeight))
})

useEventListener(window, 'mouseup', () => {
  isDragging.value = false
  document.body.style.cursor = ''
})

const startDragging = () => {
  isDragging.value = true
  document.body.style.cursor = 'row-resize'
}

const topStyle = computed<Record<string, string>>(() => {
  const h = topHeight.value
  return {
    height: `${h}px`,
    overflowY: h < 30 ? 'hidden' : 'auto',
  }
})

const bottomHidden = computed(
  () =>
    topHeight.value > (container.value ? container.value.offsetHeight : window.innerHeight) - 40,
)

onMounted(() => {
  topHeight.value = Math.abs(
    (container.value ? container.value.offsetHeight : window.innerHeight) / 2,
  )
})

const onCreateFolderButtonClick = () => {
  console.log('Create Folder')
}

// Shortcut to focus search input
useShortcut({
  keys: 'ctrl+k',
  handler: (e: KeyboardEvent) => {
    e.preventDefault()
    inputRef.value?.inputRef?.focus()
  },
})
</script>

<template>
  <div class="flex flex-col h-full w-full select-none" ref="container">
    <div class="w-full flex flex-col" :style="topStyle">
      <template v-if="topHeight > 20">
        <div class="w-full flex items-center justify-between p-2">
          <UTabs :items="tabsItems" class="gap-0" size="sm" v-model="activeTab">
            <template #leading="{ item }">
              <UTooltip :text="item.tooltip">
                <span><UIcon :name="item.icon!" class="size-4" /></span>
              </UTooltip>
            </template>
          </UTabs>

          <div class="flex items-center space-x-1">
            <UTooltip text="New Folder">
              <UButton
                variant="soft"
                color="neutral"
                icon="pajamas:folder-new"
                @click="onCreateFolderButtonClick"
              />
            </UTooltip>
            <UTooltip text="New Page or Component">
              <UButton
                variant="solid"
                color="primary"
                icon="tabler:file-plus"
                @click="componentModal = true"
              />
            </UTooltip>
          </div>
        </div>
        <div class="bg-accented/80 w-full flex items-center border-y border-default mb-1">
          <UInput
            icon="i-lucide-search"
            placeholder="Search for screens & components... (Ctrl+K)"
            class="w-full rounded-none border-b-2 border-b-transparent focus-within:border-primary"
            size="lg"
            variant="none"
            ref="input"
          />
        </div>

        <div class="px-1">
          <EScreenTree :type="activeTab" />
        </div>
      </template>
    </div>

    <div
      class="relative h-2.5 cursor-row-resize bg-border/90 hover:bg-primary/40 transition-colors group shrink-0"
      @mousedown="startDragging"
    >
      <div
        class="absolute bg-inverted left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 group-hover:opacity-100 w-8 h-1 rounded-4xl"
      ></div>
    </div>

    <div
      class="flex-1 bg-background p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded"
      :class="{ 'overflow-y-hidden p-0!': bottomHidden }"
    >
      <template v-if="!bottomHidden">
        <span class="text-muted-foreground">Used Components</span>
        <div class="h-[200vh]"></div>
      </template>
    </div>
  </div>
</template>
