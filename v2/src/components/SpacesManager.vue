<template>
  <div class="spaces-manager">
    <div class="spaces-container">
      <Space
        v-for="space in spaces"
        :key="space.id"
        :id="space.id"
        :is-active="activeSpaceIndex === spaces.indexOf(space)"
      />
    </div>
    
    <div class="spaces-navigation">
      <div class="spaces-dots">
        <button
          v-for="(space, index) in spaces"
          :key="space.id"
          class="space-dot"
          :class="{ 'space-dot--active': activeSpaceIndex === index }"
          @click="setActiveSpace(index)"
        ></button>
      </div>
      
      <div class="add-space-container">
        <button 
          class="add-space-button" 
          @click="addNewSpace"
          @mousedown="startLongPress"
          @mouseup="cancelLongPress"
          @mouseleave="cancelLongPress"
          @touchstart="startLongPress"
          @touchend="cancelLongPress"
        >
          <span class="add-space-icon">+</span>
        </button>
        
        <!-- Context Menu -->
        <Transition name="fade">
          <div v-if="showContextMenu" class="context-menu">
            <div class="context-menu__title">Create New Space</div>
            <div class="context-menu__options">
              <button class="context-menu__option" @click="createSpaceWithOption('blank')">
                <span class="context-menu__icon">📄</span>
                <span class="context-menu__text">Blank Space</span>
              </button>
              <button class="context-menu__option" @click="createSpaceWithOption('template')">
                <span class="context-menu__icon">📋</span>
                <span class="context-menu__text">From Template</span>
              </button>
              <button class="context-menu__option" @click="createSpaceWithOption('duplicate')">
                <span class="context-menu__icon">🔄</span>
                <span class="context-menu__text">Duplicate Current</span>
              </button>
              <button class="context-menu__option" @click="createSpaceWithOption('import')">
                <span class="context-menu__icon">📥</span>
                <span class="context-menu__text">Import Space</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Space from './Space.vue'

// Spaces state
const spaces = ref([
  { id: 'space-1' } // Start with one space
])

const activeSpaceIndex = ref(0)
const showContextMenu = ref(false)
let longPressTimer: number | null = null
let isLongPress = ref(false)

function setActiveSpace(index: number) {
  activeSpaceIndex.value = index
}

function addNewSpace() {
  // Skip if this was a long press
  if (isLongPress.value) {
    isLongPress.value = false
    return
  }
  
  const newSpace = {
    id: `space-${spaces.value.length + 1}`
  }
  spaces.value.push(newSpace)
  
  // Automatically navigate to the new space
  activeSpaceIndex.value = spaces.value.length - 1
  
  // Focus the input field in the new space after it's rendered
  nextTick(() => {
    const activeSpace = document.querySelector('.space.space--active')
    if (activeSpace) {
      const inputField = activeSpace.querySelector('.ai-chat__input')
      if (inputField) {
        (inputField as HTMLElement).focus()
      }
    }
  })
}

function startLongPress(event: MouseEvent | TouchEvent) {
  // Prevent default to avoid unwanted behaviors
  event.preventDefault()
  
  // Clear any existing timer
  if (longPressTimer) {
    clearTimeout(longPressTimer)
  }
  
  // Set a new timer for long press (500ms)
  longPressTimer = window.setTimeout(() => {
    isLongPress.value = true
    showContextMenu.value = true
  }, 200)
}

function cancelLongPress() {
  // Clear the timer if it exists
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function createSpaceWithOption(option: 'blank' | 'template' | 'duplicate' | 'import') {
  // Hide the context menu
  showContextMenu.value = false
  
  // Reset the long press flag
  isLongPress.value = false
  
  // Create a new space based on the selected option
  const newSpace = {
    id: `space-${spaces.value.length + 1}`
  }
  
  // Add the new space
  spaces.value.push(newSpace)
  
  // Automatically navigate to the new space
  activeSpaceIndex.value = spaces.value.length - 1
  
  // Focus the input field in the new space after it's rendered
  nextTick(() => {
    const activeSpace = document.querySelector('.space.space--active')
    if (activeSpace) {
      const inputField = activeSpace.querySelector('.ai-chat__input')
      if (inputField) {
        (inputField as HTMLElement).focus()
      }
    }
  })
  
  // Log the selected option (you can implement specific logic for each option)
  console.log(`Created new space with option: ${option}`)
}

// Handle clicks outside the context menu
function handleClickOutside(event: MouseEvent) {
  const contextMenu = document.querySelector('.context-menu')
  const addButton = document.querySelector('.add-space-button')
  
  if (showContextMenu.value && contextMenu && !contextMenu.contains(event.target as Node) && 
      addButton && !addButton.contains(event.target as Node)) {
    showContextMenu.value = false
    isLongPress.value = false
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.spaces-manager {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: visible;
}

.spaces-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.spaces-navigation {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 8px 8px 16px;
  border-radius: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  backdrop-filter: blur(10px);
}

.spaces-dots {
  display: flex;
  gap: 8px;
  margin-right: 16px;
}

/*comment*/
.space-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.space-dot--active {
  background-color: #4c6ef5;
  transform: scale(1.2);
}

.add-space-container {
  position: relative;
}

.add-space-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4c6ef5;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-space-button:hover {
  background-color: #364fc7;
  transform: scale(1.05);
}

.add-space-icon {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}

/* Context Menu Styles */
.context-menu {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.context-menu__title {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.context-menu__options {
  padding: 8px 0;
}

.context-menu__option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.context-menu__option:hover {
  background-color: #f1f3f5;
}

.context-menu__icon {
  margin-right: 12px;
  font-size: 16px;
}

.context-menu__text {
  font-size: 14px;
  color: #495057;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style> 