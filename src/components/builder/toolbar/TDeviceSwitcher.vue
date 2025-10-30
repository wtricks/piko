<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import type { DropdownMenuItem, TabsItem } from '@nuxt/ui'
import { useDeviceStore, type Device, type DeviceType } from '@/stores/device'
import { useQueryParams } from '@/composables/useQueryParams'

const toast = useToast()
const deviceStore = useDeviceStore()
const query = useQueryParams()

const currentDevice = ref<Device>()

const isAddDialogOpen = ref(false)
const newDevice = reactive<Device>({
  id: Math.random().toString(36).slice(2),
  name: '',
  width: '',
  height: '',
  fontScale: 0,
  frameImg: '',
})

const activeDeviceType = ref<DeviceType>('phone')
const activeDeviceIndex = reactive<Record<DeviceType, number>>({
  phone: -1,
  tablet: -1,
  desktop: -1,
})

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
  const activeDeviceName =
    deviceStore.devices[activeDeviceType.value as DeviceType][
      activeDeviceIndex[activeDeviceType.value]
    ]?.name

  return deviceStore.devices[activeDeviceType.value as DeviceType]?.map((device, index) => ({
    label: device.name,
    type: 'checkbox',
    checked: device.name === activeDeviceName,
    description: `${device.width} x ${device.height}`,
    onUpdateChecked(checked) {
      if (checked) {
        activeDeviceIndex[activeDeviceType.value] = index
        changeModelValue()
      }
    },
  })) as DropdownMenuItem[]
})

const changeModelValue = () => {
  currentDevice.value =
    deviceStore.devices[activeDeviceType.value][activeDeviceIndex[activeDeviceType.value]]

  query.device = currentDevice.value!.id
  query.deviceType = activeDeviceType.value
}

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

watch(
  () => activeDeviceIndex + activeDeviceType.value,
  () => {
    // Reset active device index when device type changes
    if (!activeDeviceType.value) {
      activeDeviceType.value = 'phone'
    }

    if (activeDeviceIndex[activeDeviceType.value] === -1) {
      activeDeviceIndex[activeDeviceType.value] = 0
    }

    changeModelValue()
  },
)

onBeforeMount(() => {
  if (Object.keys(activeDeviceIndex).some((key) => query.deviceType === key)) {
    activeDeviceType.value = query.deviceType as DeviceType
  } else {
    activeDeviceType.value = 'phone'
  }

  if (deviceStore.devices[activeDeviceType.value].some((device) => device.id === query.device)) {
    activeDeviceIndex[activeDeviceType.value] = deviceStore.devices[
      activeDeviceType.value
    ].findIndex((device) => device.id === query.device)
  } else {
    activeDeviceIndex[activeDeviceType.value] = 0
  }
  changeModelValue()
})
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
            <span class="text-[11px] text-dimmed">{{ currentDevice?.name || 'Select device' }}</span
            ><span class="text-[11px] block"
              >{{ currentDevice?.width }} x {{ currentDevice?.height }}</span
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
