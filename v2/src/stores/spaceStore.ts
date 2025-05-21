import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Widget, ChatMessage, Space } from '@/types'

// Define a unique ID for this store
export const useSpaceStore = defineStore('space', () => {
  // State
  const spaces = ref<Space[]>([
    // Initialize with one space
    {
      id: '1',
      widgets: [],
      chatHistory: []
    }
  ])
  
  const currentSpaceIndex = ref(0)
  const focusedWidgetId = ref<string | null>(null)

  // Getters
  const currentSpace = computed(() => spaces.value[currentSpaceIndex.value])
  const focusedWidget = computed(() => {
    if (!focusedWidgetId.value) return null
    return currentSpace.value.widgets.find(widget => widget.id === focusedWidgetId.value) || null
  })

  // Actions
  function addSpace() {
    const newId = String(spaces.value.length + 1)
    spaces.value.push({
      id: newId,
      widgets: [],
      chatHistory: []
    })
    // Navigate to the newly created space
    currentSpaceIndex.value = spaces.value.length - 1
  }

  function navigateToSpace(index: number) {
    if (index >= 0 && index < spaces.value.length) {
      currentSpaceIndex.value = index
      // Clear focused widget when changing spaces
      focusedWidgetId.value = null
    }
  }

  function addChatMessage(role: 'user' | 'assistant', content: string) {
    currentSpace.value.chatHistory.push({ role, content })
  }

  function addWidget(widget: Widget) {
    currentSpace.value.widgets.push(widget)
  }

  function toggleWidgetFocus(widgetId: string) {
    if (focusedWidgetId.value === widgetId) {
      focusedWidgetId.value = null
    } else {
      focusedWidgetId.value = widgetId
    }
  }

  function updateWidgetPosition(widgetId: string, x: number, y: number) {
    const widget = currentSpace.value.widgets.find(w => w.id === widgetId)
    if (widget) {
      widget.x = x
      widget.y = y
    }
  }

  return {
    spaces,
    currentSpaceIndex,
    focusedWidgetId,
    currentSpace,
    focusedWidget,
    addSpace,
    navigateToSpace,
    addChatMessage,
    addWidget,
    toggleWidgetFocus,
    updateWidgetPosition
  }
}) 