import type { Device } from '@/stores/device'

export const smallScreenDevices: Device[] = [
  {
    name: 'iPhone 13',
    width: '375',
    height: '667',
  },
  {
    name: 'Pixel 5',
    width: '393',
    height: '851',
  },
  {
    name: 'Galaxy S21',
    width: '360',
    height: '800',
  },
  {
    name: 'iPhone SE',
    width: '320',
    height: '568',
  },
  { name: 'iPhone 13 Pro Max', width: '428', height: '926' },
  { name: 'iPhone 12', width: '390', height: '844' },
  { name: 'iPhone 12 Pro Max', width: '428', height: '926' },
  { name: 'Pixel 4a', width: '360', height: '760' },
  { name: 'Galaxy S20', width: '360', height: '800' },
  { name: 'Galaxy Note 20', width: '412', height: '915' },
]

export const midScreenDevices: Device[] = [
  { name: 'iPad Pro 12.9"', width: '1024', height: '1366' },
  { name: 'iPad Air', width: '820', height: '1180' },
  { name: 'Galaxy Tab S7', width: '800', height: '1280' },
  { name: 'Surface Pro 7', width: '912', height: '1368' },
  { name: 'iPad Mini', width: '768', height: '1024' },
  { name: 'iPad 10.2"', width: '810', height: '1080' },
  { name: 'Galaxy Tab A7', width: '800', height: '1280' },
  { name: 'Surface Go 2', width: '912', height: '1368' },
]
export const largeScreenDevices: Device[] = [
  { name: 'Full HD', width: '1920', height: '1080' },
  { name: 'HD', width: '1366', height: '768' },
  { name: 'QHD', width: '2560', height: '1440' },
  { name: '4K UHD', width: '3840', height: '2160' },
  { name: 'MacBook Air', width: '1440', height: '900' },
  { name: 'MacBook Pro 13"', width: '2560', height: '1600' },
  { name: 'MacBook Pro 16"', width: '3072', height: '1920' },
  { name: 'iMac 24"', width: '4480', height: '2520' },
  { name: 'iMac 27"', width: '5120', height: '2880' },
  { name: 'Surface Studio 2', width: '4500', height: '3000' },
]
