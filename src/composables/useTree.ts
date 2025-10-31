import { reactive, ref, toRaw } from 'vue'
import { useDragDrop } from './useDragDrop'

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
  droppable?: boolean
  selectable?: boolean
  sorting?: boolean
  contextmenu?: boolean
}

export type TreeOptions = {
  initialTree?: TreeNode[]
  dragTarget: string
  dropTarget: string
  lock?: boolean
  initialSorting?: boolean
  variant: 'component' | 'screen'
  draggable?: boolean
  droppable?: boolean
  selectable?: boolean
  sorting?: boolean
  contextmenu?: boolean
}

export const useTree = (options: TreeOptions) => {
  ///// CORE FUNCTIONS //////
  const tree = reactive<TreeNode[]>([])
  const selectedNodes = reactive<Set<string>>(new Set())
  const openNodes = reactive<Set<string>>(new Set())
  const treeNodes = reactive<Map<string, TreeNode>>(new Map())

  const get = (raw = true) => {
    return raw ? toRaw(tree) : tree
  }

  const set = (nodes: TreeNode[], sorting = false) => {
    if (sorting) sort(nodes)
    selectedNodes.clear()
    openNodes.clear()
    initialExapandedFolders(nodes)
    tree.splice(0, tree.length, ...nodes)
  }

  const lock = () => {
    options.lock = true
  }

  const unlock = () => {
    options.lock = false
  }

  const expand = (node: TreeNode) => {
    if (isExpandable(node)) openNodes.add(node.id)
  }

  const collapse = (node: TreeNode) => {
    if (isExpandable(node)) openNodes.delete(node.id)
  }

  const toggle = (node: TreeNode) => {
    if (openNodes.has(node.id)) openNodes.delete(node.id)
    else openNodes.add(node.id)
  }

  const isExpandable = (node: TreeNode) => {
    return (
      node &&
      (node.type == 'folder' ||
        (options.variant == 'component' && (node.children?.length || 0) > 0))
    )
  }

  const isAllowed = (
    node: TreeNode,
    option: 'draggable' | 'droppable' | 'selectable' | 'sorting' | 'contextmenu',
  ) => {
    if (options.lock || !node) return false
    const temp = node[option] == undefined ? options[option] : node[option]
    return temp == undefined ? true : temp
  }

  const select = (node: TreeNode, event: MouseEvent) => {
    if (!isAllowed(node, 'selectable')) return
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    const multiSelectKeyPressed = isMac ? event.metaKey : event.ctrlKey

    if (!multiSelectKeyPressed) {
      selectedNodes.clear()
    }

    if (selectedNodes.has(node.id)) selectedNodes.delete(node.id)
    else selectedNodes.add(node.id)
  }

  const isCollapsed = (id: string) => {
    return !openNodes.has(id)
  }

  const isSelected = (id: string) => {
    return selectedNodes.has(id)
  }

  const find = (id: string): TreeNode | null => {
    return treeNodes.get(id) || null
  }

  const remove = (id: string): TreeNode | null => {
    const node = treeNodes.get(id)
    if (!node) return null

    const parent = node?.parent?.children || tree
    const index = parent.findIndex((node) => node.id == node.id)

    parent.splice(index, 1)
    treeNodes.delete(id)
    return node
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

  const collapseAll = () => {
    openNodes.clear()
  }

  const unselectAll = (ignoreSingle = true) => {
    if (ignoreSingle || selectedNodes.size > 1) selectedNodes.clear()
  }

  const selectAll = () => {
    for (const node of tree) {
      selectedNodes.add(node.id)
    }
  }

  const undo = () => {
    console.log('Undo')
  }

  const redo = () => {
    console.log('Redo')
  }

  const refresh = (sorting: boolean) => {
    if (sorting) sort(tree)
    tree.splice(0, tree.length, ...tree)
  }

  const initialExapandedFolders = (nodes: TreeNode[], parent?: TreeNode) => {
    nodes.forEach((node) => {
      treeNodes.set(node.id, node)
      node.parent = parent

      if (node.defaultState === 'open') {
        openNodes.add(node.id)
      }
      if (node.children) {
        initialExapandedFolders(node.children, node)
      }
    })
  }

  // Initial Configuration
  set(options.initialTree || [])

  ////// DRAG & DROP //////
  const dragging = ref<string[]>([]) // This is the list of currently dragged nodes
  const currentDropTarget = ref<TreeNode | null>(null)
  const dropIntent = ref<'inside' | 'sibling'>('inside')
  const isDropAbove = ref(false)

  const progress = ref(0)
  let progressInterval: number = 0

  const {
    isDragging: isMoving,
    start,
    stop,
    position,
  } = useDragDrop({
    dragAttr: options.dragTarget,
    dropAttr: options.dropTarget,
    dragStart: (dragValue: string) => {
      dragging.value = selectedNodes.size ? [...selectedNodes] : [dragValue]
      return isAllowed(treeNodes.get(dragValue)!, 'draggable')
    },
    dragMove: (dropValue: string | null, side: 'left' | 'right' | null) => {
      if (options.variant == 'component' && dropValue && dropValue != currentDropTarget.value?.id) {
        startHoldTimer()
      }

      currentDropTarget.value = dropValue ? treeNodes.get(dropValue)! : null
      isDropAbove.value = side === 'left'
    },
    dragEnd: (dropValue: string | null) => {
      const node = dropValue ? treeNodes.get(dropValue) : undefined
      if (!dropValue || dragging.value.length == 0 || !isTargetDropable(node)) {
        dragging.value = []
        currentDropTarget.value = null
        return
      }

      let targetArray: TreeNode[]
      let parentNode: TreeNode | undefined = undefined

      if (!node) {
        targetArray = tree
      } else if (dropIntent.value === 'sibling') {
        if (node.parent) {
          targetArray = node.parent.children || (node.parent.children = [])
          parentNode = node.parent
        } else {
          targetArray = tree
        }
      } else {
        targetArray = node.children || (node.children = [])
        parentNode = node
      }

      const sorting = node ? isAllowed(node, 'sorting') : options.sorting != false
      const insertIndex =
        dropIntent.value == 'inside'
          ? (targetArray.length || 1) - 1
          : targetArray.indexOf(node!) + (isDropAbove.value ? 0 : 1)

      dragging.value.forEach((source) => {
        const movedNode = remove(source)
        if (!movedNode) return

        movedNode.parent = parentNode
        treeNodes.set(movedNode.id, movedNode)
        targetArray.splice(insertIndex, 0, movedNode)
      })

      unselectAll()
      dragging.value.forEach((s) => selectedNodes.add(s))
      dragging.value = []
      currentDropTarget.value = null
      if (sorting) sort(targetArray)
    },
  })

  const startHoldTimer = () => {
    if (options.variant == 'screen') return
    clearInterval(progressInterval!)

    progress.value = 0
    dropIntent.value = 'inside'

    const totalDuration = 1500 // total = 1.5s
    const frameRate = 60
    const frameDuration = 1000 / frameRate
    const step = 100 / ((totalDuration / 1000) * frameRate)

    let elapsed = 0

    progressInterval = window.setInterval(() => {
      elapsed += frameDuration
      progress.value += step

      if (elapsed >= 500 && isExpandable(currentDropTarget.value!)) {
        openNodes.add(currentDropTarget.value!.id)
      }

      if (progress.value >= 100) {
        progress.value = 100
        dropIntent.value = 'sibling'
        clearInterval(progressInterval!)
      }
    }, frameDuration)
  }

  const isValidDropTarget = (id: string, node?: TreeNode) => {
    while (node) {
      if (node.id == id) return false
      node = node.parent
    }
    return true
  }

  const isTargetDropable = (node?: TreeNode) => {
    return (
      !node ||
      (isAllowed(node, 'droppable') &&
        (node.type == 'folder' || options.variant == 'component') &&
        dragging.value.every((n) => isValidDropTarget(n, node)))
    )
  }

  const isDropTarget = (id: string) => {
    return currentDropTarget.value?.id === id && isTargetDropable(treeNodes.get(id))
  }

  const isChildDropTarget = (id: string) => {
    const node = treeNodes.get(id)
    return node && node.id == currentDropTarget.value?.parent?.id
  }

  const isDragging = (id: string) => {
    return dragging.value.includes(id)
  }

  return {
    progress,
    isDragging,
    position,
    isDropAbove,
    treeNodes,
    tree,
    hasTimer: options.variant == 'component',
    isMoving,
    dragging,

    start,
    stop,

    lock,
    unlock,

    toggle,
    collapse,
    expand,
    select,
    find,
    remove,

    collapseAll,
    unselectAll,
    selectAll,
    undo,
    redo,
    refresh,
    get,
    set,

    isCollapsed,
    isSelected,
    isExpandable,
    isDropTarget,
    isChildDropTarget,
  }
}
