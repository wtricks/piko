import { ref, toRaw } from 'vue'

export type TreeNode = {
  id: string
  type: 'file' | 'folder'
  name: string
  icon?: string
  expandIcon?: string
  children?: TreeNode[]
  defaultState?: 'open' | 'close'
  parentId?: string
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

  const isExpandable = (node: TreeNode) => {
    return (
      node.type == 'folder' || (options.variant == 'component' && (node.children?.length || 0) > 0)
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

  const initialExapandedFolders = (nodes: TreeNode[], parentId?: string) => {
    nodes.forEach((node) => {
      node.parentId = parentId
      if (node.defaultState === 'open') {
        openNodes.value.add(node.id)
      }
      if (node.children) {
        initialExapandedFolders(node.children, node.id)
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
  const dropTarget = ref<TreeNode | null>(null)

  const startDrag = (nodes: TreeNode[]) => {
    dragging.value = nodes
  }

  const enterDropTarget = (node: TreeNode) => {
    dropTarget.value = node
    startHoldTimer()
  }

  const leaveDropTarget = (node: TreeNode) => {
    if (dropTarget.value?.id === node.id) dropTarget.value = null
    stopHoldTimer()
  }

  const drop = (node?: TreeNode) => {
    const target = node
    const sources = dragging.value
    dragging.value = []
    dropTarget.value = null
    return { sources, target }
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
    const { sources, target } = drop(
      (dropIntent.value == 'below' && node ? find(initialNodes.value, node.parentId!) : node)!,
    )
    const sorting = node?.sorting != undefined ? node.sorting : options.variant == 'screen'
    const index: number =
      dropIntent.value == 'below' && node ? (target!.children?.indexOf(node!) as number) + 1 : -1
    if (sources.length == 0 || !isTargetDropable(target)) return

    sources.forEach((source) => {
      if (source.id === target?.id) return // Prevent dropping onto itself
      const movedNode = remove(initialNodes.value, source.id)
      if (!movedNode) return

      if (target && isTargetDropable(target)) {
        movedNode.parentId = target.id
        target.children = target.children || []
        if (index != -1) target.children.splice(index, 0, movedNode)
        else target.children.push(movedNode)
      } else if (!target) {
        movedNode.parentId = undefined
        initialNodes.value.unshift(movedNode)
      }
    })

    unselectAll()
    refresh(sorting)
    sources.forEach((s) => selectedNodes.value.add(s.id))
  }

  const isChildDropTarget = (node?: TreeNode) => {
    return node && node.id == dropTarget.value?.parentId
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
  const dropIntent = ref<'inside' | 'below'>('inside')
  const progress = ref(0)
  let progressInterval: number | null = null

  const startHoldTimer = () => {
    if (options.variant == 'screen') return
    clearInterval(progressInterval!)
    console.log('start timer')
    progress.value = 0
    dropIntent.value = 'inside'

    progressInterval = window.setInterval(() => {
      progress.value += 100 / (3 * 60) // 3 sec @ 60fps
      if (progress.value >= 100) {
        progress.value = 100
        dropIntent.value = 'below'
        clearInterval(progressInterval!)
      }
    }, 1000 / 60)
  }

  const stopHoldTimer = () => {
    if (options.variant == 'screen') return
    console.log('end timer')
    clearInterval(progressInterval!)
    progress.value = 0
  }

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
    drop,
    handleDragStart,
    handleDropEnd,

    isDragging,
    isDropTarget,
    isDropTargetIsFolder,
    isDropTargetIsFile,
    isTargetDropable,
    isChildDropTarget,

    dropIntent,
    progress,
    startHoldTimer,
    stopHoldTimer,
    hasTimer: options.variant == 'component',
  }
}
