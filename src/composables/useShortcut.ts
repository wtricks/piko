import { onMounted, onUnmounted } from 'vue'

type ShortcutOptions = {
  /** e.g. 'ctrl+k', 'cmd+shift+p', ['ctrl+s', 'meta+s'] */
  keys: string | string[]
  /** Run when the shortcut is triggered */
  handler: (event: KeyboardEvent) => void
  /** Whether to prevent default browser behavior (default: true) */
  prevent?: boolean
  /** Whether shortcut works only when focused in app (default: true) */
  global?: boolean
}

export function useShortcut({ keys, handler, prevent = true, global = true }: ShortcutOptions) {
  const normalize = (combo: string) =>
    combo.toLowerCase().replace(/\s+/g, '').split('+').sort().join('+')

  const normalizedCombos = Array.isArray(keys) ? keys.map(normalize) : [normalize(keys)]

  const getPressedCombo = (e: KeyboardEvent) => {
    const parts = []
    if (e.ctrlKey) parts.push('ctrl')
    if (e.metaKey) parts.push('cmd')
    if (e.shiftKey) parts.push('shift')
    if (e.altKey) parts.push('alt')
    parts.push(e.key.toLowerCase())
    return parts.sort().join('+')
  }

  const onKeyDown = (e: KeyboardEvent) => {
    // Skip if not focused in app and global = false
    if (
      !global &&
      document.activeElement &&
      ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())
    )
      return

    const combo = getPressedCombo(e)
    if (normalizedCombos.includes(combo)) {
      if (prevent) e.preventDefault()
      handler(e)
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
