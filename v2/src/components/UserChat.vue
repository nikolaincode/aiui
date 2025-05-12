<template>
  <div class="user-chat" v-if="user">
    <div class="user-chat__header">
      <div class="user-chat__user">
        <div class="user-chat__avatar">
          <img :src="user.photo" :alt="user.name" />
          <div class="user-chat__status" :class="{ 'user-chat__status--online': user.isOnline }"></div>
        </div>
        <span class="user-chat__name">{{ user.name }}</span>
      </div>
      <div class="user-chat__header-actions">
        <button class="user-chat__close" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
        <button 
          class="user-chat__space-btn" 
          :class="{ 'user-chat__space-btn--active': isSpaceMode }"
          @click="toggleSpaceMode"
        >
          {{ isSpaceMode ? '⚡️ Sharing Space' : '⚡️ Share Space' }}
        </button>
      </div>
    </div>
    
    <div class="user-chat__messages">
      <div class="user-chat__message user-chat__message--received">
        <div class="user-chat__message-avatar">
          <img :src="user.photo" :alt="user.name" />
        </div>
        <div class="user-chat__message-content">
          <div class="user-chat__message-text">Hey! Have you notified the foreign students about the policy update?</div>
          <div class="user-chat__message-time">10:30 AM</div>
        </div>
      </div>

      <div class="user-chat__message user-chat__message--sent">
        <div class="user-chat__message-content">
          <div class="user-chat__message-text">Going well. I created a space with their contacts. About to send the emails.</div>
          <div class="user-chat__message-time">10:32 AM</div>
        </div>
      </div>

      <div class="user-chat__message user-chat__message--received">
        <div class="user-chat__message-avatar">
          <img :src="user.photo" :alt="user.name" />
        </div>
        <div class="user-chat__message-content">
          <div class="user-chat__message-text">Great! Can I have look before you do?</div>
          <div class="user-chat__message-time">10:33 AM</div>
        </div>
      </div>

    </div>
    
    <div class="user-chat__input">
      <input 
        type="text" 
        placeholder="Type a message..." 
        v-model="message"
        @keyup.enter="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggleSpace'): void
}>()

defineProps<{
  user: {
    id: number
    name: string
    photo: string
    isOnline: boolean
  } | null
}>()

const message = ref('')
const isSpaceMode = ref(false)

function sendMessage() {
  if (message.value.trim()) {
    // TODO: Implement message sending
    console.log('Sending message:', message.value)
    message.value = ''
  }
}

function toggleSpaceMode() {
  isSpaceMode.value = !isSpaceMode.value
  emit('toggleSpace')
}
</script>

<style scoped lang="scss">
.user-chat {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 32px;;
  width: 400px;
  height: 500px;
  background: white;
  border-radius: 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.user-chat__header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border-radius: 28px 28px 0 0;
}

.user-chat__user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chat__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}

.user-chat__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
  
  &--online {
    background: #4CAF50;
  }
}

.user-chat__name {
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
}

.user-chat__header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-chat__space-btn {
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e4e6e9;
  }

  &--active {
    background: #DB4F3D;
    color: #fff;

    &:hover {
      background: #DB4F3D;
    }
  }
}

.user-chat__close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #333;
    background: #eee;
  }
}

.user-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-chat__message {
  display: flex;
  gap: 12px;
  max-width: 80%;
  
  &--sent {
    margin-left: auto;
    flex-direction: row-reverse;
    
    .user-chat__message-content {
      background: #007AFF;
      color: white;
      border-radius: 16px 16px 0 16px;
      
      .user-chat__message-time {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  &--received {
    margin-right: auto;
    
    .user-chat__message-content {
      background: #f0f2f5;
      color: #1a1a1a;
      border-radius: 16px 16px 16px 0;
    }
  }
}

.user-chat__message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.user-chat__message-content {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.4;
}

.user-chat__message-time {
  font-size: 11px;
  margin-top: 4px;
  color: #666;
}

.user-chat__input {
  padding: 20px;
  border-top: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 0 0 28px 28px;
  
  input {
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
    
    &:focus {
      outline: none;
      border-color: #007AFF;
    }
  }
}
</style> 

