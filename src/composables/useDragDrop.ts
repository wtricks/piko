import { reactive, ref } from 'vue'

interface DragDropOptions {
  dragAttr: string // e.g. "data-node-id"
  dropAttr: string // e.g. "data-drop-id"
  dragStart?: (dragId: string, e: PointerEvent) => boolean
  dragMove?: (dropId: string | null, side: 'left' | 'right' | null, e: PointerEvent) => void
  dragEnd?: (dropId: string | null, side: 'left' | 'right' | null, e: PointerEvent) => void
}

export function useDragDrop(options: DragDropOptions) {
  const { dragAttr, dropAttr, dragStart, dragMove, dragEnd } = options

  const position = reactive({ x: 0, y: 0 })
  const isDragging = ref(false)
  let currentDropId: string | null = null
  let currentSide: 'left' | 'right' | null = null

  const handlePointerDown = (e?: PointerEvent) => {
    if (e) {
      const el = (e.target as HTMLElement)?.closest(`[${dragAttr}]`) as HTMLElement | null
      if (!el) return

      const dragId = el.getAttribute(dragAttr)
      if (!dragId || !dragStart?.(dragId, e)) return

      position.x = e.clientX
      position.y = e.clientY
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    isDragging.value = true
    position.x = e.clientX
    position.y = e.clientY

    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const dropEl = el?.closest(`[${dropAttr}]`) as HTMLElement | null

    if (!dropEl) {
      if (!currentDropId) return
      dragMove?.(null, null, e)
      currentDropId = null
      return
    }

    const rect = dropEl.getBoundingClientRect()
    const side = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right'
    const dropId = dropEl.getAttribute(dropAttr)

    if (dropId === currentDropId && side === currentSide) return
    currentDropId = dropId
    currentSide = side
    dragMove?.(dropId, side, e)
  }

  const handlePointerUp = (e: PointerEvent) => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)

    dragEnd?.(currentDropId, currentSide, e)

    isDragging.value = false
    currentDropId = null
  }

  const start = (root: HTMLElement, continueWithMove = false) => {
    root.addEventListener('pointerdown', handlePointerDown)
    if (continueWithMove) {
      handlePointerDown()
    }
  }

  const stop = (root: HTMLElement) => {
    root.removeEventListener('pointerdown', handlePointerDown)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  return { isDragging, start, stop, position }
}
