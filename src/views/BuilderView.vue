<script setup lang="ts">
import type { Device } from '@/stores/device'
import { ref } from 'vue'

const device = ref<Device>()
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
      <!-- NAVIGATION -->
      <!-- EXPLORER PANEL -->
      <!-- CANVAS -->
      <!-- PROPERTY PANEL -->
    </div>
  </div>
</template>
