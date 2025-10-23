import { ref } from 'vue'

const draggedComponent = ref<null | { id: string; type: string }>()

export const useDragComponent = () => {
  const startDrag = (component: { id: string; type: string }) => {
    draggedComponent.value = component
  }

  const endDrag = () => {
    draggedComponent.value = null
  }

  return { draggedComponent, startDrag, endDrag }
}
