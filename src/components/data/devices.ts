import type { Device } from '@/stores/device'

export const smallScreenDevices: Device[] = [
  { id: 'iphone-13', name: 'iPhone 13', width: '375', height: '667' },
  { id: 'pixel-5', name: 'Pixel 5', width: '393', height: '851' },
  { id: 'galaxy-s21', name: 'Galaxy S21', width: '360', height: '800' },
  { id: 'iphone-se', name: 'iPhone SE', width: '320', height: '568' },
  { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max', width: '428', height: '926' },
  { id: 'iphone-12', name: 'iPhone 12', width: '390', height: '844' },
  { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max', width: '428', height: '926' },
  { id: 'pixel-4a', name: 'Pixel 4a', width: '360', height: '760' },
  { id: 'galaxy-s20', name: 'Galaxy S20', width: '360', height: '800' },
  { id: 'galaxy-note-20', name: 'Galaxy Note 20', width: '412', height: '915' },
]

export const midScreenDevices: Device[] = [
  { id: 'ipad-pro-12-9', name: 'iPad Pro 12.9"', width: '1024', height: '1366' },
  { id: 'ipad-air', name: 'iPad Air', width: '820', height: '1180' },
  { id: 'galaxy-tab-s7', name: 'Galaxy Tab S7', width: '800', height: '1280' },
  { id: 'surface-pro-7', name: 'Surface Pro 7', width: '912', height: '1368' },
  { id: 'ipad-mini', name: 'iPad Mini', width: '768', height: '1024' },
  { id: 'ipad-10-2', name: 'iPad 10.2"', width: '810', height: '1080' },
  { id: 'galaxy-tab-a7', name: 'Galaxy Tab A7', width: '800', height: '1280' },
  { id: 'surface-go-2', name: 'Surface Go 2', width: '912', height: '1368' },
]

export const largeScreenDevices: Device[] = [
  { id: 'full-hd', name: 'Full HD', width: '1920', height: '1080' },
  { id: 'hd', name: 'HD', width: '1366', height: '768' },
  { id: 'qhd', name: 'QHD', width: '2560', height: '1440' },
  { id: '4k-uhd', name: '4K UHD', width: '3840', height: '2160' },
  { id: 'macbook-air', name: 'MacBook Air', width: '1440', height: '900' },
  { id: 'macbook-pro-13', name: 'MacBook Pro 13"', width: '2560', height: '1600' },
  { id: 'macbook-pro-16', name: 'MacBook Pro 16"', width: '3072', height: '1920' },
  { id: 'imac-24', name: 'iMac 24"', width: '4480', height: '2520' },
  { id: 'imac-27', name: 'iMac 27"', width: '5120', height: '2880' },
  { id: 'surface-studio-2', name: 'Surface Studio 2', width: '4500', height: '3000' },
]
