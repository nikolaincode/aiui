export interface User {
  id: number
  name: string
  photo: string
  color: string
  unreadCount: number
  isOnline: boolean
}

export interface Group {
  id: number
  name: string
  unreadCount: number
  members: User[]
}

export interface Widget {
  id: string
  type: string
  content: any
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface Space {
  id: string
  name: string
  widgets: Widget[]
} 