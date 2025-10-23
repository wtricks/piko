<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'

export interface ToolbarOptions {
  title: string
  branch: string
  environment: string
  syncing: boolean
}

defineProps<ToolbarOptions>()

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Feedback',
    icon: 'i-lucide-message-square-heart',
  },
  {
    label: 'Bug Report',
    icon: 'i-lucide-bug',
  },
  {
    label: 'FAQ & Docs',
    icon: 'i-lucide-book-text',
  },
  {
    label: 'Tutorials',
    icon: 'i-lucide-video',
  },
  {
    label: 'Community Forum',
    icon: 'i-lucide-users',
  },
  { label: 'Known Issues', icon: 'i-lucide-alert-triangle' },
  { label: "What's New", icon: 'i-lucide-gift' },
])

const shortcutsKeys = ref<{ label: string; keys: { shortcut: string; label: string }[] }[]>([
  {
    label: 'Navigation',
    keys: [
      { shortcut: '⌘ + K', label: 'Keyboard Shortcuts' },
      { shortcut: '⌘ + .', label: 'Open Command Palette' },
      { shortcut: '⌘ + S', label: 'Save Project' },
      { shortcut: '⌘ + Z', label: 'Undo' },
      { shortcut: '⇧ + ⌘ + Z', label: 'Redo' },
      { shortcut: '⌘ + C', label: 'Copy' },
      { shortcut: '⌘ + V', label: 'Paste' },
      { shortcut: '⌘ + X', label: 'Cut' },
      { shortcut: '⌘ + D', label: 'Duplicate' },
      { shortcut: 'Delete', label: 'Delete Selected' },
      { shortcut: 'Escape', label: 'Deselect All' },
      { shortcut: 'Tab', label: 'Next Element' },
      { shortcut: '⇧ + Tab', label: 'Previous Element' },
    ],
  },
])

const ucFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
</script>

<template>
  <span
    class="size-[3.3rem] aspect-square flex items-center justify-center border-r border-accented hover:scale-95 cursor-pointer"
  >
    <UIcon name="i-lucide-leafy-green" class="size-5 text-primary-500" />
  </span>
  <div class="px-4 block h-full space-y-0.5">
    <div class="h-full flex items-end gap-2">
      <h5 class="font-semibold text-sm text-default">{{ title }}</h5>
      <span class="text-[11px] text-dimmed">{{ syncing ? 'Syncing...' : 'Synced' }}</span>
    </div>
    <div class="flex items-center gap-3">
      <UTooltip text="Active branch">
        <span
          class="font-medium text-xs text-muted flex items-center gap-1 hover:opacity-80 cursor-pointer"
        >
          <UIcon name="i-lucide-git-branch" class="size-3" />
          {{ branch }}
        </span>
      </UTooltip>
      <UTooltip text="Project environment">
        <span
          class="font-medium text-xs text-muted flex items-center gap-1 hover:opacity-80 cursor-pointer"
        >
          <UIcon name="i-lucide-wrench" class="size-3" />
          {{ ucFirst(environment) }}
        </span>
      </UTooltip>
    </div>
  </div>
  <div class="ml-4 flex items-center gap-3">
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 4,
      }"
      :ui="{
        content: 'w-48',
        itemLeadingIcon: 'size-4 mr-1',
        item: 'py-2.5 border-b border-accented last:border-none',
        itemLabel: 'font-medium',
      }"
    >
      <UTooltip text="Help & Support">
        <UButton icon="i-lucide-badge-question-mark" size="md" variant="ghost" color="neutral" />
      </UTooltip>
    </UDropdownMenu>

    <UDrawer
      title="Keyboard Shortcuts"
      description="Use your keyboard to navigate and perform actions."
      direction="right"
      inset
      :handle="false"
    >
      <UTooltip text="Keyboard Shortcuts">
        <UButton icon="i-lucide-command" size="md" variant="ghost" color="neutral" />
      </UTooltip>

      <template #content>
        <div class="min-w-60 py-3 px-6">
          <h3 class="text-base font-semibold mb-5">Keyboard Shortcuts</h3>
          <ul class="space-y-1 overflow-y-auto max-h-full scrollbar">
            <template v-for="item in shortcutsKeys" :key="item.label">
              <h4 class="text-xs font-semibold text-dimmed mb-2">{{ item.label }}</h4>
              <template v-for="(key, index) in item.keys" :key="key.shortcut">
                <USeparator v-if="index > 0" />
                <li class="flex items-center justify-between py-1.5">
                  <span class="text-sm mr-2">{{ key.label }}</span>
                  <UKbd>{{ key.shortcut }}</UKbd>
                </li>
              </template>
            </template>
          </ul>
        </div>
      </template>
    </UDrawer>
  </div>
</template>
