<script setup lang="ts">
import type { Device } from '@/stores/device'
import type { ToolbarOptions } from './TProjectInfo.vue'

defineProps<ToolbarOptions>()
const currentDevice = defineModel<Device>('device')
</script>

<template>
  <header class="h-[3.3rem] flex items-center justify-between bg-default">
    <div class="flex items-center justify-start">
      <TProjectInfo v-bind="$props" />
    </div>
    <div class="flex items-center justify-center">
      <TDeviceSwitcher v-model="currentDevice" />
    </div>
    <div class="flex items-center justify-end">
      <TDevOptions />
    </div>
  </header>
</template>
