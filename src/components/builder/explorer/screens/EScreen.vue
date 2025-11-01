<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { TabsItem } from '@nuxt/ui'
import { useShortcut } from '@/composables/useShortcut'
import { useProjectStore } from '@/stores/project'
import { useQueryRef } from '@/composables/useQueryRef'

export type FolderType = 'all' | 'screens' | 'components'

const container = ref<HTMLDivElement>()
const activeTab = useQueryRef<FolderType>('all', 'tab', (v) => tabsItems.some((i) => i.value === v))

const showComponentOnly = ref(false)

const topHeight = ref(200)
const isDragging = ref(false)
const componentModal = ref(false)

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

////////////  TREE ////////////
const treeStore = useProjectStore()

watch(activeTab, () => {
  treeStore.setType(activeTab.value)
})
</script>

<template>
  <div class="flex flex-col h-full w-full select-none" ref="container">
    <div v-if="!showComponentOnly" class="w-full flex flex-col" :style="topStyle">
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
                icon="iconoir:folder-plus"
                @click="onCreateFolderButtonClick"
              />
            </UTooltip>
            <UTooltip text="New Page or Component">
              <UButton
                variant="solid"
                color="primary"
                icon="line-md:file-plus"
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

        <div class="w-full flex-1 overflow-y-auto scrollbar flex">
          <TreeView :config="treeStore.screenTree" size="md" />
        </div>
      </template>
    </div>

    <div
      v-if="!showComponentOnly"
      class="relative h-2.5 cursor-row-resize bg-border/90 hover:bg-primary/40 transition-colors group shrink-0"
      @mousedown="startDragging"
    >
      <div
        class="absolute bg-inverted left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70 group-hover:opacity-100 w-8 h-1 rounded-4xl"
      ></div>
    </div>

    <div
      class="flex-1 bg-background overflow-y-auto scrollbar"
      :class="{ 'overflow-y-hidden p-0!': bottomHidden }"
    >
      <div class="flex items-center p-2">
        <UIcon name="tdesign:component-radio" class="size-6" />
        <h5 class="font-semibold ml-2">Components</h5>

        <div class="flex items-center space-x-1 ml-auto">
          <UTooltip :text="showComponentOnly ? 'Show pages & components' : 'Show components only'">
            <UButton
              variant="soft"
              color="neutral"
              icon="proicons:panel-left-expand"
              :class="showComponentOnly ? 'rotate-90' : '-rotate-90'"
              @click="showComponentOnly = !showComponentOnly"
            />
          </UTooltip>
          <UTooltip text="Collapsed View">
            <UButton variant="soft" color="neutral" icon="solar:list-up-linear" />
          </UTooltip>
        </div>
      </div>
      <div class="bg-accented/80 w-full flex items-center border-y border-default mb-1">
        <UInput
          icon="i-lucide-search"
          placeholder="Search for components... (Ctrl+K)"
          class="w-full rounded-none border-b-2 border-b-transparent focus-within:border-primary"
          size="lg"
          variant="none"
          ref="input"
        />
      </div>
      <div class="w-full flex-1 overflow-y-auto scrollbar flex">
        <TreeView :config="treeStore.componentTree" size="md" />
      </div>
    </div>
  </div>
</template>
