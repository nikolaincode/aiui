<template>
  <div class="collaboration-panel" :class="{ 'collaboration-panel--expanded': isExpanded }">
    <!-- Collapsed State -->
    <div class="collaboration-panel__header" @click="togglePanel">
      <div class="collaboration-panel__avatars">
        <div v-for="(user, index) in activeUsers" 
             :key="user.id" 
             class="collaboration-panel__avatar"
             :style="{ zIndex: activeUsers.length - index }">
          <img :src="user.photo" :alt="user.name" />
          <div class="collaboration-panel__status" :class="{ 'collaboration-panel__status--online': user.isOnline }"></div>
        </div>
      </div>
      <div class="collaboration-panel__toggle">
        <i class="fas" :class="isExpanded ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </div>
      <div v-if="totalUnreadCount > 0 && !isExpanded" class="collaboration-panel__badge collaboration-panel__badge--total">
        {{ totalUnreadCount > 99 ? '99+' : totalUnreadCount }}
      </div>
    </div>

    <!-- Expanded State -->
    <div v-if="isExpanded" class="collaboration-panel__content">
      <div class="collaboration-panel__section">
        <div class="collaboration-panel__section-header">
          <h3>Active Users</h3>
          <button class="collaboration-panel__invite" @click="showInviteModal = true">
            <i class="fas fa-user-plus"></i> Invite
          </button>
        </div>
        <div class="collaboration-panel__users">
          <div v-for="user in activeUsers" 
               :key="user.id" 
               class="collaboration-panel__user"
               :class="{ 'collaboration-panel__user--active': activeChat?.type === 'user' && activeChat?.id === user.id }"
               @click="openChat(user)">
            <div class="collaboration-panel__avatar">
              <img :src="user.photo" :alt="user.name" />
              <div class="collaboration-panel__status" :class="{ 'collaboration-panel__status--online': user.isOnline }"></div>
              <div v-if="user.unreadCount" class="collaboration-panel__badge">
                {{ user.unreadCount > 99 ? '99+' : user.unreadCount }}
              </div>
            </div>
            <span class="collaboration-panel__name">{{ user.name }}</span>
          </div>
        </div>
      </div>

      <div class="collaboration-panel__section">
        <div class="collaboration-panel__section-header">
          <h3>Groups</h3>
          <button class="collaboration-panel__create-group" @click="showCreateGroupModal = true">
            <i class="fas fa-plus"></i> New Group
          </button>
        </div>
        <div class="collaboration-panel__groups">
          <div v-for="group in groups" 
               :key="group.id" 
               class="collaboration-panel__group"
               :class="{ 'collaboration-panel__group--active': activeChat?.type === 'group' && activeChat?.id === group.id }"
               @click="openChat(group)">
            <div class="collaboration-panel__group-content">
              <div class="collaboration-panel__group-avatars">
                <div v-for="(member, index) in group.members.slice(0, 3)" 
                     :key="member.id" 
                     class="collaboration-panel__avatar"
                     :style="{ zIndex: 3 - index }">
                  <img :src="member.photo" :alt="member.name" />
                  <div class="collaboration-panel__status" :class="{ 'collaboration-panel__status--online': member.isOnline }"></div>
                </div>
                <div v-if="group.members.length > 3" class="collaboration-panel__avatar collaboration-panel__avatar--more">
                  +{{ group.members.length - 3 }}
                </div>
              </div>
              <span class="collaboration-panel__name">{{ group.name }}</span>
            </div>
            <div v-if="group.unreadCount" class="collaboration-panel__badge collaboration-panel__badge--group">
              {{ group.unreadCount > 99 ? '99+' : group.unreadCount }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showCreateGroupModal" class="collaboration-panel__modal">
      <div class="collaboration-panel__modal-content">
        <h3>Create New Group</h3>
        <input v-model="newGroupName" placeholder="Group Name" />
        <div class="collaboration-panel__modal-actions">
          <button @click="createGroup">Create</button>
          <button @click="showCreateGroupModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showInviteModal" class="collaboration-panel__modal">
      <div class="collaboration-panel__modal-content">
        <h3>Invite People</h3>
        <input v-model="inviteEmail" placeholder="Email Address" />
        <div class="collaboration-panel__modal-actions">
          <button @click="sendInvite">Send Invite</button>
          <button @click="showInviteModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add UserChat component -->
    <UserChat 
      v-if="activeChat?.type === 'user'"
      :user="activeUsers.find(u => u.id === activeChat.id) || null"
      @close="activeChat = null"
      @toggle-space="toggleSpaceMode"
    />

    <!-- Space mode overlay -->
    <div v-if="isSpaceMode" class="space-mode-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UserChat from './UserChat.vue'
import type { User, Group } from '@/types'

// State
const isExpanded = ref(false)
const showCreateGroupModal = ref(false)
const showInviteModal = ref(false)
const newGroupName = ref('')
const inviteEmail = ref('')
const activeChat = ref<{ type: 'user' | 'group', id: number } | null>(null)
const isSpaceMode = ref(false)

// Mock data - replace with real data from your backend
const activeUsers = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    photo: 'https://i.pravatar.cc/150?img=1',
    color: '#FF5733',
    unreadCount: 3,
    isOnline: true
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    photo: 'https://i.pravatar.cc/150?img=5',
    color: '#33FF57',
    unreadCount: 0,
    isOnline: false
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    photo: 'https://i.pravatar.cc/150?img=8',
    color: '#3357FF',
    unreadCount: 12,
    isOnline: true
  }
])

const groups = ref([
  { 
    id: 1, 
    name: 'Student Admin', 
    unreadCount: 0,
    members: [
      { id: 1, name: 'John Doe', photo: 'https://i.pravatar.cc/150?img=1', isOnline: true },
      { id: 2, name: 'Jane Smith', photo: 'https://i.pravatar.cc/150?img=5', isOnline: false },
      { id: 3, name: 'Bob Johnson', photo: 'https://i.pravatar.cc/150?img=8', isOnline: true },
      { id: 4, name: 'Alice Brown', photo: 'https://i.pravatar.cc/150?img=9', isOnline: true }
    ]
  },
  { 
    id: 2, 
    name: 'Generation 2025', 
    unreadCount: 0,
    members: [
      { id: 5, name: 'Charlie Wilson', photo: 'https://i.pravatar.cc/150?img=3', isOnline: false },
      { id: 6, name: 'Diana Miller', photo: 'https://i.pravatar.cc/150?img=4', isOnline: true },
      { id: 7, name: 'Edward Davis', photo: 'https://i.pravatar.cc/150?img=6', isOnline: true },
      { id: 8, name: 'Fiona Clark', photo: 'https://i.pravatar.cc/150?img=7', isOnline: false },
      { id: 9, name: 'George Taylor', photo: 'https://i.pravatar.cc/150?img=2', isOnline: true }
    ]
  }
])

// Compute total unread count
const totalUnreadCount = computed(() => {
  const userUnread = activeUsers.value.reduce((sum, user) => sum + (user.unreadCount || 0), 0)
  const groupUnread = groups.value.reduce((sum, group) => sum + (group.unreadCount || 0), 0)
  return userUnread + groupUnread
})

// Methods
function togglePanel() {
  isExpanded.value = !isExpanded.value
}

function openChat(entity: User | Group) {
  activeChat.value = {
    type: 'members' in entity ? 'group' : 'user',
    id: entity.id
  }
}

function createGroup() {
  if (newGroupName.value.trim()) {
    groups.value.push({
      id: groups.value.length + 1,
      name: newGroupName.value,
      unreadCount: 0,
      members: []
    })
    newGroupName.value = ''
    showCreateGroupModal.value = false
  }
}

function sendInvite() {
  if (inviteEmail.value.trim()) {
    // Implement invite sending logic
    console.log('Sending invite to:', inviteEmail.value)
    inviteEmail.value = ''
    showInviteModal.value = false
  }
}

function toggleSpaceMode() {
  isSpaceMode.value = !isSpaceMode.value
}
</script>

<style scoped lang="scss">
.collaboration-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100px;
  overflow: visible;
  
  &--expanded {
    width: 300px;
  }
}

.collaboration-panel__header {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 32px;
  background: white;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #f8f9fa;
  }
}

.collaboration-panel__avatars {
  display: flex;
  position: relative;
}

.collaboration-panel__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: visible;
  margin-left: -10px;
  border: 2px solid white;
  position: relative;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  &:first-child {
    margin-left: 0;
  }
}

.collaboration-panel__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
  
  &--online {
    background: #4CAF50;
  }
}

.collaboration-panel__toggle {
  margin-left: auto;
  color: #666;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .collaboration-panel--expanded & {
    transform: rotate(180deg);
  }
}

.collaboration-panel__content {
  padding: 16px;
  border-top: 1px solid #eee;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .collaboration-panel--expanded & {
    opacity: 1;
    transform: translateX(0);
  }
}

.collaboration-panel__section {
  margin-bottom: 24px;
}

.collaboration-panel__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  h3 {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.collaboration-panel__users,
.collaboration-panel__groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.collaboration-panel__user,
.collaboration-panel__group {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &--active {
    background-color: #e9ecef;
    
    &:hover {
      background-color: #e9ecef;
    }
  }
}

.collaboration-panel__name {
  margin-left: 12px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
  padding-right: 8px;
}

.collaboration-panel__group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  gap: 12px;
  
  &:hover {
    background-color: #f5f5f5;
  }
}

.collaboration-panel__group-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 8px;
}

.collaboration-panel__group-avatars {
  display: flex;
  margin-right: 12px;
  position: relative;
  width: 86px;
  flex-shrink: 0;
}

.collaboration-panel__avatar--more {
  background: #f0f0f0;
  color: #666;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  margin-left: -10px;
  flex-shrink: 0;
}

.collaboration-panel__badge {
  position: absolute;
  top: -8px;
right: -10px;
  background: #DB4F3D;
  color: white;
  font-size: 11px;
  font-weight: 900;
  min-width: 18px;
  height: 19px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
  z-index: 1;
}

.collaboration-panel__badge--group {
  position: static;
  margin-left: 0;
  flex-shrink: 0;
  min-width: 24px;
  text-align: center;
}

.collaboration-panel__create-group,
.collaboration-panel__invite {
  padding: 6px 12px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #eee;
  }
}

.collaboration-panel__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.collaboration-panel__modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  
  h3 {
    margin-bottom: 16px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 16px;
  }
}

.collaboration-panel__modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  
  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    
    &:first-child {
      background: #007AFF;
      color: white;
    }
    
    &:last-child {
      background: #f5f5f5;
      color: #666;
    }
  }
}

.collaboration-panel__badge--total {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #DB4F3D;
  color: white;
  font-size: 11px;
  font-weight: 900;
  min-width: 18px;
  height: 19px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
  z-index: 1;
}

.space-mode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 12px solid #DB4F3D;
  pointer-events: none;
  z-index: 9999;
}
</style> 