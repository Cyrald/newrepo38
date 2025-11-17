import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  isMinimized: boolean
  
  // Actions
  openChat: () => void
  closeChat: () => void
  toggleMinimize: () => void
}

export const useChatStore = create<ChatState>()((set) => ({
  isOpen: false,
  isMinimized: false,

  openChat: () => {
    set({ isOpen: true, isMinimized: false })
  },

  closeChat: () => {
    set({ isOpen: false, isMinimized: false })
  },

  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }))
  },
}))
