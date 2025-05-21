<template>
  <div 
    class="widget" 
    :class="{ 
      'widget--focused': isFocused,
      'widget--dragging': isDragging,
      'widget--pop': isPopping
    }" 
    :style="{ transform: `translate(${widget.position.x}px, ${widget.position.y}px)` }"
    @click="handleClick"
    @mousedown="startDrag"
  >
    <div class="widget__header">
      <div class="widget__type">{{ widgetTitle }}</div>
      <button class="widget__close" @click.stop="$emit('remove')">×</button>
    </div>
    <div class="widget__content">
      <component 
        :is="widgetComponent" 
        :content="widget.content"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted, onUnmounted } from 'vue'

// Import actual widget components
const ChartWidget = defineAsyncComponent(() => import('./widgets/ChartWidget.vue'))
const TableWidget = defineAsyncComponent(() => import('./widgets/TableWidget.vue'))
const DocumentWidget = defineAsyncComponent(() => import('./widgets/DocumentWidget.vue'))
const ImageWidget = defineAsyncComponent(() => import('./widgets/ImageWidget.vue'))

const props = defineProps<{
  widget: {
    id: string
    type: 'chart' | 'table' | 'document' | 'image'
    content: any
    position: { x: number, y: number }
    promptHistory: string[]
  }
  isFocused: boolean
}>()

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'remove'): void
  (e: 'update-position', position: { x: number, y: number }): void
}>()

// Dragging state
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })
const hasDragged = ref(false)

const isPopping = ref(true)

function startDrag(event: MouseEvent) {
  // Only start drag if clicking on the header
  if ((event.target as HTMLElement).closest('.widget__header')) {
    isDragging.value = true
    hasDragged.value = false
    dragStart.value = { x: event.clientX, y: event.clientY }
    initialPosition.value = { ...props.widget.position }
    
    // Prevent text selection during drag
    event.preventDefault()
    
    // Add global event listeners
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }
}

function onDrag(event: MouseEvent) {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragStart.value.x
  const deltaY = event.clientY - dragStart.value.y
  
  // If moved more than 5px, mark as dragged
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    hasDragged.value = true
  }
  
  const newPosition = {
    x: initialPosition.value.x + deltaX,
    y: initialPosition.value.y + deltaY
  }
  
  emit('update-position', newPosition)
}

function stopDrag() {
  isDragging.value = false
  
  // Remove global event listeners
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function handleClick() {
  // Only emit focus if we haven't dragged
  if (!hasDragged.value) {
    emit('focus')
  }
}

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

onMounted(() => {
  // Start the pop animation
  isPopping.value = true
  // Remove the pop class after animation completes
  setTimeout(() => {
    isPopping.value = false
  }, 500)
})

const widgetComponent = computed(() => {
  switch (props.widget.type) {
    case 'chart':
      return ChartWidget
    case 'table':
      return TableWidget
    case 'document':
      return DocumentWidget
    case 'image':
      return ImageWidget
    default:
      return null
  }
})

const widgetTitle = computed(() => {
  if (props.widget.type === 'chart' && props.widget.content?.options?.plugins?.title?.text) {
    return props.widget.content.options.plugins.title.text
  }
  if (props.widget.type === 'table') {
    return 'Foreign Students'
  }
  return props.widget.type.charAt(0).toUpperCase() + props.widget.type.slice(1)
})
</script>

<style scoped>
.widget {
  position: absolute;
  width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease, border 0.2s ease;
  z-index: 1;
  cursor: move;
  will-change: transform;
  transform-origin: center;
}

.widget--dragging {
  transition: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.widget--focused {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid #4c6ef5;
  z-index: 20;
}

.widget--pop {
  animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  0% {
    transform: scale(0.8) translate(var(--x), var(--y));
    opacity: 0;
  }
  50% {
    transform: scale(1.1) translate(var(--x), var(--y));
  }
  100% {
    transform: scale(1) translate(var(--x), var(--y));
    opacity: 1;
  }
}

.widget__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  cursor: move;
}

.widget__type {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.widget__close {
  background: none;
  border: none;
  font-size: 20px;
  color: #868e96;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.widget__close:hover {
  color: #495057;
}

.widget__content {
  /**padding: 16px;**/
}
</style> 