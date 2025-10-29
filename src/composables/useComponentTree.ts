import { refDebounced } from '@vueuse/core'
import { ref, shallowRef, toRaw, watch } from 'vue'

export type TreeNode = {
  id: string
  type?: 'file' | 'folder'
  name: string
  icon?: string
  expandIcon?: string
  children?: TreeNode[]
  defaultState?: 'open' | 'close'
  parent?: TreeNode
  draggable?: boolean
  dropable?: boolean
  selectable?: boolean
  sorting?: boolean
  contextmenu?: boolean
}

export type ComponentTreeOptions = {
  initialTree?: TreeNode[]
  lock?: boolean
  initialSorting?: boolean
  variant: 'component' | 'screen'
  selectable?: boolean
  dragAndDrop?: boolean
}

export const useComponentTree = (options: ComponentTreeOptions) => {
  ///////////////// CORE LOGIC //////////////////////
  const openNodes = ref<Set<string>>(new Set())
  const selectedNodes = ref<Set<string>>(new Set())
  const initialNodes = ref<TreeNode[]>([])

  const isLocked = ref(false)

  const get = (raw = true) => {
    return raw ? toRaw(initialNodes) : initialNodes.value
  }

  const set = (nodes: TreeNode[], sorting = false) => {
    if (sorting) sort(nodes)
    initialExapandedFolders(nodes)
    initialNodes.value = nodes
  }

  const toggle = (node: TreeNode) => {
    if (openNodes.value.has(node.id)) collapse(node)
    else expand(node)
  }

  const collapse = (node: TreeNode) => {
    if (isExpandable(node)) openNodes.value.delete(node.id)
  }

  const expand = (node: TreeNode) => {
    if (isExpandable(node)) openNodes.value.add(node.id)
  }

  const select = (node: TreeNode, event: MouseEvent) => {
    if ((node.selectable == undefined ? options.selectable : node.selectable) == false) return
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    const multiSelectKeyPressed = isMac ? event.metaKey : event.ctrlKey

    if (!multiSelectKeyPressed) {
      selectedNodes.value.clear()
    }

    if (selectedNodes.value.has(node.id)) selectedNodes.value.delete(node.id)
    else selectedNodes.value.add(node.id)
  }

  const isCollapsed = (id: string) => {
    return !openNodes.value.has(id)
  }

  const isSelected = (id: string) => {
    return selectedNodes.value.has(id)
  }

  const isExpandable = (node?: TreeNode) => {
    return (
      (node && node.type == 'folder') ||
      (node && options.variant == 'component' && (node.children?.length || 0) > 0)
    )
  }

  const find = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = find(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  const remove = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i] as TreeNode
      if (node.id === id) {
        nodes.splice(i, 1)
        return node
      }
      if (node.children) {
        const removed = remove(node.children, id)
        if (removed) return removed
      }
    }
    return null
  }

  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'folder' ? -1 : 1
    })

    nodes.forEach((item) => {
      if (item.children) sort(item.children)
    })
  }

  const initialExapandedFolders = (nodes: TreeNode[], parent?: TreeNode) => {
    nodes.forEach((node) => {
      node.parent = parent
      if (node.defaultState === 'open') {
        openNodes.value.add(node.id)
      }
      if (node.children) {
        initialExapandedFolders(node.children, node)
      }
    })
  }

  const collapseAll = () => {
    openNodes.value.clear()
  }

  const unselectAll = (ignoreSingle = true) => {
    if (ignoreSingle || selectedNodes.value.size > 1) selectedNodes.value.clear()
  }

  const selectAll = () => {
    for (const node of initialNodes.value) {
      selectedNodes.value.add(node.id)
    }
  }

  const undo = () => {
    console.log('Undo')
  }

  const redo = () => {
    console.log('Redo')
  }

  const refresh = (sorting: boolean) => {
    if (sorting) sort(initialNodes.value)
    initialNodes.value = [...initialNodes.value]
  }

  // Initial Configuration
  if (options.initialSorting) {
    sort(options.initialTree || [])
  }

  initialNodes.value = options.initialTree || []
  initialExapandedFolders(initialNodes.value)
  isLocked.value = options.lock || false

  ///////////////// DRAG & DROP //////////////////////
  const isDraggingNode = ref(false)
  const dragging = ref<TreeNode[]>([])
  const dropTarget = shallowRef<TreeNode | null>(null)
  const dropTargetDebounceRef = refDebounced(dropTarget, 120)

  const dropAbove = ref<boolean>(true)

  const startDrag = (nodes: TreeNode[]) => {
    dragging.value = nodes
  }

  const enterDropTarget = (node: TreeNode) => {
    dropTarget.value = node
  }

  const leaveDropTarget = (node: TreeNode) => {
    if (dropTarget.value?.id === node.id) dropTarget.value = null
  }

  const dragOver = (event: DragEvent) => {
    if (options.variant == 'screen') return
    const rect = (event.currentTarget as HTMLElement)?.getBoundingClientRect()
    const x = event.clientX - (rect?.left || 0)
    dropAbove.value = !(x < rect?.width / 2)
  }

  const isDragging = (node: TreeNode) => {
    return dragging.value.some((n) => n.id === node.id)
  }

  const isDropTarget = (node: TreeNode) => {
    return dropTarget.value?.id === node.id && isTargetDropable(node)
  }

  const isDropTargetIsFolder = () => {
    return dropTarget.value?.type === 'folder'
  }

  const isDropTargetIsFile = () => {
    return dropTarget.value?.type === 'file'
  }

  const handleDragStart = (event: DragEvent, node: TreeNode) => {
    if ((node.draggable == undefined ? options.dragAndDrop : node.draggable) == false) return
    const nodesToDrag = isSelected(node.id)
      ? (Array.from(selectedNodes.value)
          .map((id) => find(initialNodes.value, id))
          .filter(Boolean) as TreeNode[])
      : [node]

    startDrag(nodesToDrag)
    isDraggingNode.value = true
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer?.setData('text/plain', 'dragging')
  }

  const endDrag = () => {
    isDraggingNode.value = false
  }

  const handleDropEnd = (node?: TreeNode) => {
    if (dragging.value.length == 0 || !isTargetDropable(node)) {
      dragging.value = []
      dropTarget.value = null
      return
    }

    let targetArray: TreeNode[]
    let parentNode: TreeNode | undefined = undefined

    if (!node) {
      targetArray = initialNodes.value
    } else if (dropIntent.value === 'sibling') {
      if (node.parent) {
        targetArray = node.parent.children || (node.parent.children = [])
        parentNode = node.parent
      } else {
        targetArray = initialNodes.value
      }
    } else {
      targetArray = node.children || (node.children = [])
      parentNode = node
    }

    const sorting = node?.sorting != undefined ? node.sorting : options.variant == 'screen'
    const insertIndex =
      dropIntent.value == 'inside'
        ? (targetArray.length || 1) - 1
        : targetArray.indexOf(node!) + (dropAbove.value ? 0 : 1)

    dragging.value.forEach((source) => {
      const movedNode = remove(initialNodes.value, source.id)
      if (!movedNode) return

      movedNode.parent = parentNode
      targetArray.splice(insertIndex, 0, movedNode)
    })

    unselectAll()
    dragging.value.forEach((s) => selectedNodes.value.add(s.id))
    dragging.value = []
    dropTarget.value = null
    refresh(sorting)
  }

  const isChildDropTarget = (node?: TreeNode) => {
    return node && node.id == dropTargetDebounceRef.value?.parent?.id
  }

  const isTargetDropable = (node?: TreeNode) => {
    return (
      !node ||
      ((node.type == 'folder' || options.variant == 'component') &&
        !(node.draggable == false) &&
        (dragging.value || []).every((n) => n.id != node.id))
    )
  }

  ///////////////// TIMER //////////////////////
  const dropIntent = ref<'inside' | 'sibling'>('inside')
  const progress = ref(0)
  let progressInterval: number | null = null

  const startHoldTimer = () => {
    if (options.variant == 'screen') return
    clearInterval(progressInterval!)

    progress.value = 0
    dropIntent.value = 'inside'

    const totalDuration = 1600 // total = 1.6s
    const frameRate = 60
    const frameDuration = 1000 / frameRate
    const step = 100 / ((totalDuration / 1000) * frameRate)

    let elapsed = 0

    progressInterval = window.setInterval(() => {
      elapsed += frameDuration
      progress.value += step

      if (elapsed >= 500 && isExpandable(dropTarget.value!)) {
        openNodes.value.add(dropTarget.value!.id)
      }

      if (progress.value >= 100) {
        progress.value = 100
        dropIntent.value = 'sibling'
        clearInterval(progressInterval!)
      }
    }, frameDuration)
  }

  const stopHoldTimer = () => {
    if (options.variant == 'screen') return
    clearInterval(progressInterval!)
    progress.value = 0
  }

  watch(dropTargetDebounceRef, (curr, prev) => {
    if (prev && curr && curr.id == prev.id) {
    } else {
      if (prev) {
        stopHoldTimer()
      }
      if (curr) {
        startHoldTimer()
      }
    }
  })

  return {
    set,
    get,
    toggle,
    collapse,
    expand,
    select,
    find,
    remove,
    sort,
    collapseAll,
    unselectAll,
    selectAll,
    undo,
    redo,
    refresh,

    isCollapsed,
    isSelected,
    isExpandable,

    isDraggingNode,
    startDrag,
    endDrag,
    enterDropTarget,
    leaveDropTarget,
    handleDragStart,
    handleDropEnd,
    dragOver,

    isDragging,
    isDropTarget,
    isDropTargetIsFolder,
    isDropTargetIsFile,
    isTargetDropable,
    isChildDropTarget,

    dropAbove,
    dropIntent,
    progress,
    startHoldTimer,
    stopHoldTimer,
    hasTimer: options.variant == 'component',
  }
}
