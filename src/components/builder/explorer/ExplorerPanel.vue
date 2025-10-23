<script setup lang="ts">
import { defineAsyncComponent, computed, ref, watch, type Component } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { NavigationItem } from '../navigation/NavigationPanel.vue'

const activetab = defineModel<NavigationItem | ''>()

const config = ref({
  width: 320,
  minWidth: 320,
  maxWidth: 320,
  shrinkable: false,
})

let startX = 0
let startWidth = 0
const resizing = ref(false)

const startResizing = (e: MouseEvent) => {
  startX = e.clientX
  startWidth = config.value.width
  resizing.value = true
}

useEventListener('mousemove', (e: MouseEvent) => {
  if (!resizing.value) return
  const newWidth = startWidth + (e.clientX - startX)
  config.value.width = Math.min(Math.max(newWidth, config.value.minWidth), config.value.maxWidth)
})

useEventListener('mouseup', () => {
  if (resizing.value) resizing.value = false
})

type ComponentSection = {
  minWidth: number
  maxWidth: number
  shrinkable: boolean
  component: Component
}

type ComponentSectionObject = Record<NavigationItem, ComponentSection>

const componentSections: ComponentSectionObject = {
  components: {
    minWidth: 320,
    maxWidth: 500,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./components/EComponent.vue')),
  },
  screens: {
    minWidth: 320,
    maxWidth: 600,
    shrinkable: false,
    component: defineAsyncComponent(() => import('./screens/EScreen.vue')),
  },
  store: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  api: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  media: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  'data-types': {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  styles: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  'core-functions': {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  extensions: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
  settings: {
    minWidth: 320,
    maxWidth: 400,
    shrinkable: true,
    component: defineAsyncComponent(() => import('./DummyComponent.vue')),
  },
}

const activeSection = computed(() => {
  return activetab.value ? componentSections[activetab.value as NavigationItem] : null
})

watch(
  activeSection,
  (section) => {
    if (section) {
      config.value.minWidth = section.minWidth
      config.value.maxWidth = section.maxWidth
      config.value.shrinkable = section.shrinkable
      config.value.width = Math.max(
        config.value.minWidth,
        Math.min(config.value.width, config.value.maxWidth),
      )
    }
  },
  { immediate: true },
)
</script>

<template>
  <Transition name="fade" mode="out-in">
    <aside
      v-if="activeSection"
      class="flex flex-col bg-default relative border-t border-accented"
      :class="{ 'pr-2': config.shrinkable }"
      :style="{
        width: !config.shrinkable ? '19rem' : config.width + 'px',
        boxShadow: !config.shrinkable ? 'unset' : '3px 0 4px rgba(0,0,0,0.2)',
      }"
    >
      <component :is="activeSection.component" />

      <div
        v-if="config.shrinkable"
        class="absolute top-0 right-0 w-2 h-full cursor-col-resize bg-border/90 hover:bg-primary/30 flex justify-center items-center"
        @mousedown.prevent="startResizing"
      >
        <span class="bg-inverted opacity-70 group-hover:opacity-100 w-1 h-8 rounded-4xl"></span>
      </div>
    </aside>
  </Transition>
</template>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
