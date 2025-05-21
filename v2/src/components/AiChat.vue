<template>
  <div class="ai-chat" :class="{ 'ai-chat--widget-focused': focusedWidget }">
    <div class="ai-chat__header">
      <h2 v-if="!focusedWidget">Constructor SIS</h2>
      <h2 v-else>Configure Widget</h2>
    </div>
    
    <div class="ai-chat__messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in displayMessages" 
        :key="index"
        class="ai-chat__message"
        :class="{
          'ai-chat__message--user': message.role === 'user',
          'ai-chat__message--assistant': message.role === 'assistant'
        }"
      >
        <div class="ai-chat__message-content">
          {{ message.content }}
        </div>
        
        <div 
          v-if="message.role === 'assistant' && message.generatedContent" 
          class="ai-chat__generated-content"
        >
          <div class="ai-chat__preview">
            <component 
              :is="getPreviewComponent(message.generatedContent.type)" 
              :content="message.generatedContent.content"
              preview
            />
          </div>
          
          <button 
            v-if="!message.pinned"
            class="ai-chat__pin-button" 
            @click="pinContent(message.generatedContent, index)"
          >
            Pin to Canvas
          </button>
        </div>
      </div>
    </div>
    
    <div class="ai-chat__input-container">
      <textarea 
        ref="inputRef"
        v-model="userInput" 
        class="ai-chat__input"
        placeholder="Ask me anything..."
        @keydown.enter.prevent="handleSend"
        :disabled="false"
      ></textarea>
    </div>

    <div class="ai-chat__suggestions">
      <button class="ai-chat__suggestion" @click="handleSuggestion('action')">
        <span class="ai-chat__suggestion-icon">⚡</span>
        Create
      </button>
      <button class="ai-chat__suggestion" @click="handleSuggestion('lookup')">
        <span class="ai-chat__suggestion-icon">🔍</span>
        Lookup
      </button>
      <button class="ai-chat__suggestion" @click="handleSuggestion('automation')">
        <span class="ai-chat__suggestion-icon">🤖</span>
        Automate
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, defineAsyncComponent, onMounted, onUnmounted } from 'vue'

// Import widget components
const ChartWidget = defineAsyncComponent(() => import('./widgets/ChartWidget.vue'))
const TableWidget = defineAsyncComponent(() => import('./widgets/TableWidget.vue'))
const DocumentWidget = defineAsyncComponent(() => import('./widgets/DocumentWidget.vue'))
const ImageWidget = defineAsyncComponent(() => import('./widgets/ImageWidget.vue'))

// Define interfaces for message types to fix TS errors
interface BaseMessage {
  role: 'user' | 'assistant'
  content: string
}

interface UserMessage extends BaseMessage {
  role: 'user'
}

interface AssistantMessage extends BaseMessage {
  role: 'assistant'
  generatedContent?: {
    type: 'chart' | 'table' | 'document' | 'image'
    content: any
  }
  pinned?: boolean
}

type Message = UserMessage | AssistantMessage

const props = defineProps<{
  focusedWidget: {
    id: string
    type: 'chart' | 'table' | 'document' | 'image'
    content: any
    promptHistory: string[]
  } | undefined
  spaceId: string
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'generate-content', payload: {
    type: 'chart' | 'table' | 'document' | 'image'
    content: any
    promptHistory: string[]
    position: { x: number; y: number }
  }): void
}>()

const userInput = ref('')
const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: getInitialMessage(props.spaceId)
  }
])
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// Function to get the initial message based on the space ID
function getInitialMessage(spaceId: string): string {
  switch (spaceId) {
    case 'space-1':
      return 'Hello! I\'m here to help you. What would you like to know?'
    case 'space-2':
      return 'What shall we do now?'
    case 'space-3':
      return 'Hello again.'
    default:
      return 'Hello! I\'m here to help you. What would you like to know?'
  }
}

// When a widget is focused, show its prompt history instead of the regular chat
const displayMessages = computed(() => {
  if (!props.focusedWidget) {
    return messages.value
  }
  
  console.log('Focused widget:', props.focusedWidget)
  console.log('Prompt history:', props.focusedWidget.promptHistory)
  
  // Convert prompt history to messages format
  return props.focusedWidget.promptHistory.map((prompt, index, array) => {
    if (index % 2 === 0) {
      return { role: 'user' as const, content: prompt } as UserMessage
    } else {
      const isLast = index === array.length - 1
      
      return { 
        role: 'assistant' as const, 
        content: prompt,
        ...(isLast ? {
          generatedContent: {
            type: props.focusedWidget!.type,
            content: props.focusedWidget!.content
          },
          pinned: true
        } : {})
      } as AssistantMessage
    }
  })
})

const handleSend = async () => {
  if (!userInput.value.trim()) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  // Clear input
  userInput.value = ''

  // Check if this is the third message
  if (messages.value.filter(m => m.role === 'user').length === 3) {
    // Add specific response for third message
    messages.value.push({
      role: 'assistant',
      content: "There's 12 foreign students enrolled."
    })
    scrollToBottom()
    return
  }

  // Check if this is the fourth message
  if (messages.value.filter(m => m.role === 'user').length === 4) {
    // Generate table data
    const tableData = {
      type: 'table' as const,
      content: `
        <table style="width: 100%; border-collapse: collapse; font-family: 'Manrope', sans-serif;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 2px solid #e9ecef;">Name</th>
              <th style="text-align: left; border-bottom: 2px solid #e9ecef;">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">John Smith</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">john.smith@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Maria Garcia</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">maria.g@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Ahmed Hass</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">ahmed.hass@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Sophie Dub</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">sophie.dub@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Lucas Müller</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">lucas.muller@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Yuki Tanaka</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">yuki.tanaka@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Ela Petrova</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">ela.p@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Carlos Silva</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">carlos.s@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Aisha Khan</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">aisha.khan@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">David Kim</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">david.kim@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Fatima Alm</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">fatima.alm@example.com</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e9ecef; color: #212529;">Tom Smith</td>
              <td style="border-bottom: 1px solid #e9ecef; color: #495057;">tom.s@example.com</td>
            </tr>
          </tbody>
        </table>
        `
    }

    // Add response with table
    messages.value.push({
      role: 'assistant',
      content: "Here's a table of all foreign students:",
      generatedContent: tableData
    })
    scrollToBottom()
    return
  }

  // Check if this is the second message
  if (messages.value.filter(m => m.role === 'user').length === 2) {
    // Generate chart data
    const chartData = {
      type: 'chart' as const,
      content: {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Students',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#4c6ef5',
            backgroundColor: 'rgba(76, 110, 245, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'New Students (6 months)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Students'
              }
            }
          }
        }
      }
    }

    // Add response with chart
    messages.value.push({
      role: 'assistant',
      content: "Here's a chart showing newly joined students in the past 6 months:",
      generatedContent: chartData
    })
    scrollToBottom()
    return
  }

  // Skip loading state for first message
  const isFirstUserMessage = messages.value.filter(m => m.role === 'user').length === 1
  
  // Declare loading message outside if block
  const loadingMessage: AssistantMessage = {
    role: 'assistant',
    content: 'Thinking...'
  }
  
  if (!isFirstUserMessage) {
    // Show loading state
    messages.value.push(loadingMessage)
  }

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove loading message if it exists
    if (!isFirstUserMessage) {
      messages.value = messages.value.filter(m => m !== loadingMessage)
    }

    // Generate response and content
    const responseContent = generateResponse(userInput.value)
    const generatedContent = generateContent(userInput.value)
    
    // Add assistant response
    messages.value.push({
      role: 'assistant',
      content: responseContent,
      ...(generatedContent ? { generatedContent } : {})
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    // Remove loading message if it exists
    if (!isFirstUserMessage) {
      messages.value = messages.value.filter(m => m !== loadingMessage)
    }
    // Add error message
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, there was an error processing your message.'
    })
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function generateResponse(prompt: string): string {
  // Check if this is the first user message
  const isFirstUserMessage = messages.value.filter(m => m.role === 'user').length === 1
  
  if (isFirstUserMessage) {
    return 'Hello there.'
  }
  
  // For the second message, return a response about the chart
  const isSecondUserMessage = messages.value.filter(m => m.role === 'user').length === 2
  if (isSecondUserMessage) {
    return 'Here\'s a chart showing newly joined students in the past 60 days:'
  }
  
  // Default response for other messages
  return 'I\'m not sure how to respond to that. Could you try asking something else?'
}

function generateContent(prompt: string): { type: 'chart' | 'table' | 'document' | 'image', content: any } | null {
  // Only generate content for the second message
  const isSecondUserMessage = messages.value.filter(m => m.role === 'user').length === 2
  
  if (isSecondUserMessage) {
    // Generate sample data for the last 60 days
    const today = new Date()
    const labels = Array.from({ length: 60 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (59 - i))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
    
    // Generate random data points
    const data = Array.from({ length: 60 }, () => Math.floor(Math.random() * 20) + 5)
    
    return {
      type: 'chart',
      content: {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'New Students',
            data: data,
            borderColor: '#4c6ef5',
            backgroundColor: 'rgba(76, 110, 245, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'New Students (Last 60 Days)'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Students'
              }
            }
          }
        }
      }
    }
  }
  
  return null
}

function pinContent(content: any, messageIndex: number) {
  // Mark message as pinned
  if (messageIndex < messages.value.length && messages.value[messageIndex].role === 'assistant') {
    (messages.value[messageIndex] as AssistantMessage).pinned = true
  }
  
  // Get prompt history for this content
  const promptHistory: string[] = []
  
  // Find the user prompt that led to this response
  if (messageIndex > 0 && messages.value[messageIndex - 1].role === 'user') {
    promptHistory.push(messages.value[messageIndex - 1].content)
    promptHistory.push(messages.value[messageIndex].content)
  }
  
  // Calculate position for the new widget
  const existingWidgets = document.querySelectorAll('.widget')
  const lastWidget = existingWidgets[existingWidgets.length - 1]
  let position = { x: 0, y: 0 }
  
  if (lastWidget) {
    const rect = lastWidget.getBoundingClientRect()
    position = {
      x: rect.left,
      y: rect.bottom + 20 // Add 20px spacing between widgets
    }
  }
  
  // Emit event to parent to add this as a widget
  emit('generate-content', {
    type: content.type,
    content: content.content,
    promptHistory,
    position
  })
}

function getPreviewComponent(type: 'chart' | 'table' | 'document' | 'image') {
  switch (type) {
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
}

function handleSuggestion(type: 'lookup' | 'action' | 'automation') {
  let message = ''
  switch (type) {
    case 'lookup':
      message = 'What would you like me to look up?'
      break
    case 'action':
      message = 'Create a chart '
      break
    case 'automation':
      message = 'What would you like me to automate?'
      break
  }
  userInput.value = message
  // Focus the input field after setting the text
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// Auto-scroll to bottom when messages change
watch(messages, () => {
  scrollToBottom()
})

// Watch for changes in focusedWidget to handle scrolling
watch(() => props.focusedWidget, (newValue) => {
  nextTick(() => {
    if (messagesContainer.value) {
      if (newValue) {
        // When widget is focused, scroll to top
        messagesContainer.value.scrollTop = 0
      } else {
        // When widget is unfocused, scroll to bottom
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }
  })
})

// Add global keydown listener
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

function handleGlobalKeydown(event: KeyboardEvent) {
  // Ignore if already focused or if typing in an input/textarea
  const activeElement = document.activeElement as HTMLElement
  if (activeElement?.tagName === 'INPUT' || 
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.isContentEditable) {
    return
  }
  
  // Find the active space
  const activeSpace = document.querySelector('.space.space--active')
  if (!activeSpace) {
    return
  }
  
  // Check if this AiChat component is in the active space
  const aiChatElement = inputRef.value?.closest('.space')
  if (!aiChatElement || aiChatElement !== activeSpace) {
    return
  }
  
  // Focus input if it's a printable character
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
.ai-chat {
  background-color: white;
  border-radius: 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  height: 60vh;
  max-height: 500px;
  transition: all 0.3s ease;
  z-index: 10;
  width: 400px;
}

.ai-chat--widget-focused {
  border: 2px solid #4c6ef5;
}

.ai-chat__header {
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
  background-color: #f9f9f9;
  border-radius: 28px 28px 0 0;
}

.ai-chat__header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 700;
  text-align: center;
}

.ai-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-chat__message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.ai-chat__message--user {
  align-self: flex-end;
}

.ai-chat__message--assistant {
  align-self: flex-start;
}

.ai-chat__message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.4;
}

.ai-chat__message--user .ai-chat__message-content {
  background-color: #4c6ef5;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-chat__message--assistant .ai-chat__message-content {
  background-color: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.ai-chat__generated-content {
  margin-top: 12px;
  border: 1px solid #eaeaea;
  border-radius: 16px;
  overflow: hidden;
}

.ai-chat__preview {
  padding: 0;
  background-color: white;
  overflow: hidden;
}

.ai-chat__pin-button {
  width: 100%;
  padding: 8px 0;
  background-color: #4c6ef5;
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-chat__pin-button:hover {
  background-color: #364fc7;
}

.ai-chat__input-container {
  padding: 16px;
  height: 82px;
  border-top: 1px solid #eaeaea;
}

.ai-chat__input {
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 0.95rem;
  resize: none;
  height: 48px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.ai-chat__input:focus {
  border-color: #4c6ef5;
}

.ai-chat__suggestions {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 28px 28px;
  justify-content: center;
}

.ai-chat__suggestion {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-chat__suggestion:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.ai-chat__suggestion-icon {
  font-size: 14px;
}
</style> 