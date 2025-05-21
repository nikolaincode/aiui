<template>
  <div
    class="space"
    :class="{ 'space--active': isActive }"
    :data-space-id="id"
  >
    <div class="space__content">
      <div class="space__widgets">
        <widget
          v-for="widget in widgets"
          :key="widget.id"
          :widget="widget"
          :is-focused="focusedWidgetId === widget.id"
          @focus="toggleWidgetFocus(widget.id)"
          @remove="removeWidget(widget.id)"
          @update-position="updateWidgetPosition(widget.id, $event)"
          :style="{
            '--x': `${widget.position.x}px`,
            '--y': `${widget.position.y}px`
          }"
        />
      </div>
      <div class="space__chat">
        <ai-chat
          :focused-widget="focusedWidget"
          :space-id="id"
          :is-active="isActive"
          @generate-content="handleGeneratedContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Widget from './Widget.vue'
import AiChat from './AiChat.vue'

const props = defineProps<{
  id: string
  isActive: boolean
}>()

// Widget state
const widgets = ref<Array<{
  id: string
  type: 'chart' | 'table' | 'document' | 'image'
  content: any
  position: { x: number, y: number }
  promptHistory: string[]
}>>([])

const focusedWidgetId = ref<string | null>(null)

const focusedWidget = computed(() => 
  widgets.value.find(widget => widget.id === focusedWidgetId.value)
)

function toggleWidgetFocus(widgetId: string) {
  focusedWidgetId.value = focusedWidgetId.value === widgetId ? null : widgetId
}

function removeWidget(widgetId: string) {
  const index = widgets.value.findIndex(widget => widget.id === widgetId)
  if (index !== -1) {
    widgets.value.splice(index, 1)
    if (focusedWidgetId.value === widgetId) {
      focusedWidgetId.value = null
    }
  }
}

function handleGeneratedContent(payload: {
  type: 'chart' | 'table' | 'document' | 'image'
  content: any
  promptHistory: string[]
  position: { x: number, y: number }
}) {
  const newWidget = {
    id: `widget-${Date.now()}`,
    type: payload.type,
    content: payload.content,
    position: payload.position,
    promptHistory: payload.promptHistory
  }
  widgets.value.push(newWidget)
}

function updateWidgetPosition(widgetId: string, position: { x: number, y: number }) {
  const widget = widgets.value.find(w => w.id === widgetId)
  if (widget) {
    widget.position = position
  }
}
</script>

<style scoped>
.space {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f9f9f9;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  overflow: visible;
}

.space--active {
  opacity: 1;
  pointer-events: all;
}

.space__content {
  position: relative;
  width: 100%;
  height: 100%;
}

.space__widgets {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.space__chat {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 400px;
}

/* Placeholder styles for local components */
.widget-placeholder, .ai-chat-placeholder {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
  color: #666;
}

.ai-chat-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 