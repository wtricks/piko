<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { DropdownMenuItem, TabsItem } from '@nuxt/ui'
import { useDeviceStore, type Device, type DeviceType } from '@/stores/device'
import { useQueryRef } from '@/composables/useQueryRef'

const toast = useToast()
const deviceStore = useDeviceStore()

const isAddDialogOpen = ref(false)
const newDevice = reactive<Device>({
  id: Math.random().toString(36).slice(2),
  name: '',
  width: '',
  height: '',
  fontScale: 0,
  frameImg: '',
})

const activeDeviceType = useQueryRef<DeviceType>('phone', 'deviceType', (v) =>
  items.value.some((i) => i.value === v),
)

const activeDeviceId = useQueryRef<string>('', 'device')
const currentActiveDevice = computed(
  () =>
    deviceStore.devices[activeDeviceType.value].find((d) => d.id === activeDeviceId.value) ||
    deviceStore.devices[activeDeviceType.value][0],
)

const items = ref<TabsItem[]>([
  {
    label: '',
    icon: 'i-ic-baseline-phone-iphone',
    value: 'phone',
  },
  {
    label: '',
    icon: 'i-lucide-tablet',
    value: 'tablet',
  },
  {
    label: '',
    icon: 'i-lucide-monitor',
    value: 'desktop',
  },
])

const deviceItems = computed<DropdownMenuItem[]>(() => {
  return deviceStore.devices[activeDeviceType.value as DeviceType]?.map((device) => ({
    label: device.name,
    type: 'checkbox',
    checked: device.name === currentActiveDevice.value?.name,
    description: `${device.width} x ${device.height}`,
    onUpdateChecked(checked) {
      if (checked) {
        activeDeviceId.value = device.id
      }
    },
  })) as DropdownMenuItem[]
})

const addDevice = () => {
  if (!newDevice.name) {
    toast.add({
      title: 'Device name is required',
      color: 'error',
    })
    return
  }

  if (!newDevice.width) {
    toast.add({
      title: 'Select device width',
      color: 'error',
    })
    return
  }

  if (!newDevice.height) {
    toast.add({
      title: 'Select device height',
      color: 'error',
    })
    return
  }

  deviceStore.devices[activeDeviceType.value].push(newDevice as Device)
  isAddDialogOpen.value = false

  // Reset new device form
  newDevice.id = Math.random().toString(36).slice(2)
  newDevice.fontScale = 0
  newDevice.frameImg = ''
  newDevice.name = ''
  newDevice.width = ''
  newDevice.height = ''

  toast.add({
    title: 'Device added successfully',
    color: 'success',
  })
}
</script>
<template>
  <div class="flex items-center justify-between gap-4">
    <UFieldGroup size="sm">
      <UTabs
        :items="items"
        class="gap-0 [&_[role=tablist]]:rounded-tr-none [&_[role=tablist]]:rounded-br-none"
        size="sm"
        v-model="activeDeviceType"
      />
      <UDropdownMenu
        :items="deviceItems"
        :content="{
          align: 'start',
          side: 'bottom',
          sideOffset: 4,
        }"
        :ui="{
          content: 'w-60',
          itemLeadingIcon: 'size-4 mr-1',
          item: 'py-2 border-b border-accented last:border-none',
          itemLabel: 'font-medium',
        }"
      >
        <UButton variant="soft" color="neutral" class="py-0">
          <div>
            <span class="text-[11px] text-dimmed">{{
              currentActiveDevice?.name || 'Select device'
            }}</span
            ><span class="text-[11px] block"
              >{{ currentActiveDevice?.width }} x {{ currentActiveDevice?.height }}</span
            >
          </div>
          <UIcon name="i-lucide-chevron-down" />
        </UButton>

        <template #content-top>
          <div class="p-1 border-b border-accented">
            <UButton
              variant="soft"
              color="neutral"
              size="lg"
              class="w-full"
              @click="isAddDialogOpen = true"
            >
              <UIcon name="i-lucide-plus" class="size-4 mr-1" />
              Add custom device
            </UButton>
          </div>
        </template>
        <template #item-label="{ item }">
          <div class="flex flex-col">
            <span class="text-sm">{{ item.label }}</span>
            <span class="text-[11px] text-dimmed">{{ item.description }}</span>
          </div>
        </template>
      </UDropdownMenu>
    </UFieldGroup>
  </div>

  <UModal
    title="Add Custom Device"
    :open="isAddDialogOpen"
    :close="false"
    :ui="{
      header: 'min-h-12 py-2 !px-3',
      close: 'top-2 border-b-0',
      footer: 'min-h-12 py-2 !px-3 border-t-0',
      body: '!px-3 py-3',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-3">
        <UInput v-model="newDevice.name" placeholder="Device Name" :ui="{ base: 'py-3' }" />
        <div class="grid grid-cols-2 gap-2">
          <UInput
            type="number"
            v-model="newDevice.width"
            placeholder="Width (px)"
            :ui="{ base: 'py-3' }"
          />
          <UInput
            type="number"
            v-model="newDevice.height"
            placeholder="Height (px)"
            :ui="{ base: 'py-3' }"
          />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UInput
            type="file"
            v-model="newDevice.frameImg"
            placeholder="Frame Image URL"
            :ui="{ base: 'py-3' }"
          />
          <UInput
            type="number"
            step="0.1"
            v-model="newDevice.fontScale"
            min="0.1"
            max="2"
            placeholder="Font Scale (e.g., 1.0)"
            :ui="{ base: 'py-3' }"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton color="neutral" variant="soft" @click="isAddDialogOpen = false"> Cancel </UButton>
        <UButton color="primary" @click="addDevice"> Save Device </UButton>
      </div>
    </template>
  </UModal>
</template>
