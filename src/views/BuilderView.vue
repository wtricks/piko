<script setup lang="ts">
import { ref } from 'vue'
import type { Device } from '@/stores/device'
import type { NavigationItem } from '@/components/builder/navigation/NavigationPanel.vue'

const device = ref<Device>()
const sidebar = ref<NavigationItem>('components')
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-elevated">
    <ToolbarPanel
      title="WhatsApp Clone"
      branch="main"
      environment="development"
      syncing
      v-model:device="device"
    />
    <div class="flex flex-1 overflow-hidden">
      <NavigationPanel v-model="sidebar" />
      <!-- EXPLORER PANEL -->
      <!-- CANVAS -->
      <!-- PROPERTY PANEL -->
    </div>
  </div>
</template>
