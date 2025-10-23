import { ref } from 'vue'
import { defineStore } from 'pinia'
import { largeScreenDevices, midScreenDevices, smallScreenDevices } from '@/components/data/devices'

export type DeviceType = 'phone' | 'tablet' | 'desktop'

export type Device = {
  name: string
  width: string
  height: string
  type?: DeviceType
  frameImg?: string
  frameColor?: string
  fontScale?: number
}

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Record<DeviceType, Device[]>>({
    phone: smallScreenDevices,
    tablet: midScreenDevices,
    desktop: largeScreenDevices,
  })

  const addNewDevice = (device: Device, type: DeviceType) => {
    devices.value[type].push(device)
  }

  return {
    devices,
    addNewDevice,
  }
})
