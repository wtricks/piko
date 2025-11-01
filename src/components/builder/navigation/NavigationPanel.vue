<script setup lang="ts">
import { useQueryRef } from '@/composables/useQueryRef'

export type NavigationItem =
  | 'components'
  | 'screens'
  | 'store'
  | 'api'
  | 'media'
  | 'data-types'
  | 'styles'
  | 'core-functions'
  | 'extensions'
  | 'settings'

const options: {
  label: string
  value: NavigationItem
  icon: string
}[] = [
  { label: 'Components', value: 'components', icon: 'tdesign:component-radio' },
  { label: 'Screens', value: 'screens', icon: 'i-iconoir-multiple-pages' },
  { label: 'Store', value: 'store', icon: 'i-carbon-datastore' },
  { label: 'API', value: 'api', icon: 'i-carbon-content-delivery-network' },
  { label: 'Media Assets', value: 'media', icon: 'i-iconoir-media-video-list' },
  { label: 'Data Types', value: 'data-types', icon: 'i-iconoir-plug-type-l' },
  { label: 'Styles', value: 'styles', icon: 'i-teenyicons-brush-outline' },
  { label: 'Core Functions', value: 'core-functions', icon: 'i-mdi-function-variant' },
  { label: 'Extensions', value: 'extensions', icon: 'i-bi-plugin' },
  { label: 'Settings', value: 'settings', icon: 'i-heroicons-cog-6-tooth' },
]

const activeOption = useQueryRef<NavigationItem | ''>('', 'page', (v) =>
  options.some((option) => option.value === v),
)

const handleOptionChange = (value: NavigationItem) => {
  if (activeOption.value === value) {
    activeOption.value = ''
    return
  }
  activeOption.value = value
}
</script>

<template>
  <nav
    :class="{ 'border-r': activeOption }"
    class="w-[3.3rem] border-t border-accented bg-default flex flex-col items-center py-2 gap-3"
  >
    <UTooltip
      v-for="option in options"
      :key="option.value"
      :delay-duration="500"
      :text="option.label"
      :content="{
        align: 'center',
        side: 'right',
        sideOffset: 8,
      }"
      arrow
    >
      <span :class="option.value == 'settings' ? 'mt-auto' : ''">
        <UButton
          :aria-label="option.label"
          size="lg"
          @click="handleOptionChange(option.value)"
          :icon="option.icon"
          :variant="activeOption === option.value ? 'solid' : 'ghost'"
          :color="activeOption === option.value ? 'primary' : 'neutral'"
        />
      </span>
    </UTooltip>
  </nav>

  <ExplorerPanel v-if="activeOption" />
</template>
