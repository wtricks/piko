<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { TabsItem, AccordionItem, DropdownMenuItem } from '@nuxt/ui'
import { useDragComponent } from '@/composables/useDragComponent'
import {
  useComponentStore,
  type ComponentGroup,
  type ComponentItem,
  type ComponentType,
  type LibraryType,
} from '@/stores/component'
import { useShortcut } from '@/composables/useShortcut'

interface ComponentItemType extends AccordionItem {
  items?: ComponentItem[]
}

const componentStore = useComponentStore()

const iconCardMin = 80
const imageCardMin = 140

const tabsItems: TabsItem[] = [
  {
    label: '',
    value: 'builtin',
    tooltip: 'Built-in components',
    icon: 'codicon:project',
  },
  {
    label: '',
    value: 'project',
    tooltip: 'Project components',
    icon: 'mdi:video-input-component',
  },
  {
    label: '',
    value: 'library',
    tooltip: 'Third-party components',
    icon: 'fluent:library-32-filled',
  },
]

// Component drag and drop handlers
const { startDrag, endDrag } = useDragComponent()
const onDragStart = (event: DragEvent, comp: ComponentItem) => {
  event.dataTransfer?.setData('application/json', JSON.stringify(comp))
  event.dataTransfer!.effectAllowed = 'copy'
  startDrag({ id: comp.id, type: activeTab.value })
}

const onDragEnd = () => {
  endDrag()
}

const searchComponent = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const activeLibraries = ref<string[]>([])
const activeTab = ref<ComponentType>('builtin')

const componentModals = ref<Record<ComponentType, string[]>>({
  builtin: [],
  project: [],
  library: [],
})

const builtinComponents = ref<ComponentItemType[]>([])
const projectComponents = ref<ComponentItemType[]>([])
const libraryComponents = ref<ComponentItemType[]>([])

const generateComponentItems = (groups: ComponentGroup[]): ComponentItemType[] =>
  groups.map((g) => ({
    label: g.groupName,
    value: g.groupId,
    items: g.items,
  }))

const onSelect = (component: ComponentItem) => {
  console.log({ component, type: activeTab.value })
}

const addComponent = () => {
  if (activeTab.value === 'project') {
    console.log('Add project component')
  } else if (activeTab.value === 'library') {
    console.log('Add library')
  }
}

const activeTabContent = computed(() => {
  switch (activeTab.value) {
    case 'builtin':
      return builtinComponents.value
    case 'project':
      return projectComponents.value
    case 'library':
      return libraryComponents.value
    default:
      return []
  }
})

const filterGroup = (group: ComponentItemType, term: string): ComponentItemType | null => {
  const filteredItems = group.items?.filter((item) => item.name.toLowerCase().includes(term))
  if (!filteredItems || filteredItems.length === 0) return null
  return { label: group.label, value: group.value, items: filteredItems }
}

const filteredTabContent = computed(() => {
  const term = searchComponent.value.toLowerCase().trim()
  if (!term) return activeTabContent.value
  return (
    activeTabContent.value
      // @ts-expect-error TypeScript can't infer that filterGroup may return null
      .map((group) => filterGroup(group, term))
      .filter((g): g is ComponentItemType => g !== null)
  )
})

const activeLibraryList = computed<DropdownMenuItem[]>(() => {
  return (componentStore.components.library as LibraryType[]).map((lib) => ({
    label: lib.name,
    value: lib.id,
    icon: lib.icon,
    checked: activeLibraries.value.includes(lib.id),
    type: 'checkbox',
    onUpdateChecked(checked: boolean) {
      if (checked) {
        if (!activeLibraries.value.includes(lib.id)) {
          activeLibraries.value = [...activeLibraries.value, lib.id]
        }
      } else {
        activeLibraries.value = activeLibraries.value.filter((id) => id !== lib.id)
      }
    },
  }))
})

onBeforeMount(() => {
  builtinComponents.value = generateComponentItems(
    componentStore.components.builtin as ComponentGroup[],
  )
  projectComponents.value = generateComponentItems(
    componentStore.components.project as ComponentGroup[],
  )

  // by default all the libraries will be active
  activeLibraries.value = (componentStore.components.library as LibraryType[]).map(
    (group) => group.id,
  )

  // Initial values, so accordion expanded by default
  componentModals.value.builtin = builtinComponents.value.map((group) => group.value!)
  componentModals.value.project = projectComponents.value.map((group) => group.value!)

  componentModals.value.library = (
    (componentStore.components.library as LibraryType[])
      .filter((group) => activeLibraries.value.indexOf(group.id) != -1)
      .map((group) => group.items)
      .flat(1) as unknown as ComponentGroup[]
  ).map((group) => group.groupId)
})

watch(activeLibraries, () => {
  libraryComponents.value = generateComponentItems(
    (componentStore.components.library as LibraryType[])
      .filter((group) => activeLibraries.value.includes(group.id))
      .map((group) => group.items)
      .flat(1) as unknown as ComponentGroup[],
  )
})

// Shortcut for focusing search input (Ctrl+K)
useShortcut({
  keys: 'ctrl+k',
  handler(event) {
    event.preventDefault()
    // @ts-expect-error inputRef type
    if (inputRef.value.inputRef) {
      // @ts-expect-error inputRef type
      inputRef.value.inputRef.focus()
    }
  },
})
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="w-full flex items-center justify-between p-2 mb-0.5">
      <UTabs :items="tabsItems" class="gap-0" size="sm" v-model="activeTab">
        <template #leading="{ item }">
          <UTooltip :text="item.tooltip">
            <span><UIcon :name="item.icon!" class="size-4" /></span>
          </UTooltip>
        </template>
      </UTabs>

      <div class="flex items-center space-x-1">
        <UTooltip text="Refresh">
          <UButton variant="soft" color="neutral" icon="eva:refresh-outline" />
        </UTooltip>

        <UDropdownMenu
          v-if="activeTab === 'library'"
          :items="activeLibraryList"
          :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 4,
          }"
          arrow
          :ui="{
            content: 'w-48',
            itemLeadingIcon: 'size-4 mr-1',
            item: 'py-2.5 border-b border-accented last:border-none',
            itemLabel: 'font-medium',
          }"
        >
          <UTooltip text="Filter libraries">
            <UButton variant="soft" color="neutral" icon="hugeicons:filter" />
          </UTooltip>
        </UDropdownMenu>

        <UTooltip
          v-if="activeTab !== 'builtin'"
          :text="activeTab === 'project' ? 'Add component' : 'Add library'"
        >
          <UButton
            variant="solid"
            color="primary"
            icon="i-lucide-plus"
            class="ml-2"
            @click="addComponent"
          />
        </UTooltip>
      </div>
    </div>

    <div class="bg-accented w-full flex items-center border-y border-accented mb-1">
      <UInput
        icon="i-lucide-search"
        placeholder="Search components... (Ctrl+K)"
        class="w-full rounded-none border-b-2 border-b-transparent focus-within:border-primary"
        size="lg"
        variant="none"
        v-model="searchComponent"
        ref="inputRef"
      />
    </div>

    <div class="flex-1 overflow-y-auto h-full w-full">
      <div
        v-if="activeTabContent.length === 0"
        class="flex flex-col items-center justify-center h-full text-muted-foreground py-12 px-2"
      >
        <UIcon name="mdi:package-variant-remove" class="size-12 opacity-50 mb-2" />
        <p class="font-medium text-center">No components found</p>
        <p class="text-sm opacity-70 text-center">Try changing filters or adding new components</p>
      </div>
      <UAccordion
        v-else
        :items="filteredTabContent"
        class="px-2"
        type="multiple"
        unmountOnHide
        v-model="componentModals[activeTab]"
        :ui="{ label: 'font-semibold' }"
      >
        <template #content="{ item }">
          <div
            class="grid gap-2 py-2"
            :style="{
              gridTemplateColumns: `repeat(auto-fill, minmax(${item.items && item.items[0] ? (item.items[0].image ? imageCardMin : iconCardMin) : iconCardMin}px, 1fr))`,
            }"
          >
            <template v-for="comp in item.items" :key="comp.id">
              <UPopover
                mode="hover"
                :open-delay="1000"
                :close-delay="0"
                arrow
                :content="{
                  align: 'center',
                  side: 'right',
                  sideOffset: 8,
                }"
              >
                <template #content>
                  <template v-if="comp.description">
                    <div class="max-w-xs p-2 text-sm text-muted">
                      <b>{{ comp.name }}</b
                      >: {{ comp.description }}
                    </div>
                  </template>
                </template>
                <button
                  draggable="true"
                  @dragstart="(e) => onDragStart(e, comp)"
                  @dragend="onDragEnd"
                  class="group flex flex-col items-start gap-2 p-1 rounded-md border border-muted/30 focus:outline-none group bg-default"
                  @click="onSelect(comp)"
                  :title="comp.name"
                >
                  <div
                    v-if="comp.image"
                    draggable="false"
                    class="w-full aspect-video rounded-md overflow-hidden flex items-center justify-center pointer-events-none select-none"
                  >
                    <img
                      :src="comp.image"
                      :alt="comp.name"
                      class="object-contain w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  <div v-else class="w-full flex items-center justify-center py-2">
                    <UIcon
                      v-if="comp.icon"
                      :name="comp.icon"
                      class="size-10 flex items-center justify-center text-muted group-hover:text-default"
                      aria-hidden="true"
                    />
                    <div
                      v-else
                      class="size-10 rounded bg-muted flex items-center justify-center text-sm"
                    >
                      {{ comp.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>

                  <div class="text-xs w-full text-center">
                    <div
                      class="font-semibold text-center text-muted truncate group-hover:text-default"
                    >
                      {{ comp.name }}
                    </div>
                  </div>
                </button>
              </UPopover>
            </template>
          </div>
        </template>
      </UAccordion>
    </div>
  </div>
</template>
