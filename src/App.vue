<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { useWindowSize } from '@vueuse/core'

const mode = useColorMode()
const { width } = useWindowSize()

const reloadPage = () => {
  window.location.reload()
}

const isDevlopmentMode = import.meta.env.DEV
</script>

<template>
  <UApp>
    <RouterView v-if="width > 999" />
    <div v-else class="flex flex-col items-center justify-center h-screen text-center px-4">
      <UIcon name="i-heroicons-device-phone-mobile" class="w-36 h-36 text-gray-400 mb-4" />
      <h1 class="text-2xl font-semibold mb-2">Screen Too Small</h1>
      <p class="text-gray-500 max-w-sm mb-6">
        This app is optimized for larger screens. Please open it on a desktop or a device with a
        wider display.
      </p>
      <UButton variant="soft" icon="i-heroicons-arrow-path" label="Retry" @click="reloadPage" />
    </div>
    <UButton
      v-if="isDevlopmentMode"
      color="neutral"
      variant="ghost"
      :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
      class="fixed bottom-4 right-4"
      @click="mode = mode === 'dark' ? 'light' : 'dark'"
    />
  </UApp>
</template>
