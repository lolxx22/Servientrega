import { create } from 'zustand';
import type { ChatMessage } from '../types';
import api from '../services/api';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  tokensUsed: number;
  addMessage: (message: ChatMessage) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  tokensUsed: 0,

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen, messages: state.isOpen ? [] : state.messages })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false, messages: [] }),

  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    get().addMessage(userMessage);
    set({ isTyping: true });

    try {
      const messages = get().messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data } = await api.post('/ai/chat', { messages });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data.content,
        timestamp: new Date(),
      };

      get().addMessage(assistantMessage);

      if (data.data.tokensUsed) {
        set({ tokensUsed: get().tokensUsed + data.data.tokensUsed });
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      get().addMessage(errorMessage);
    } finally {
      set({ isTyping: false });
    }
  },

  clearMessages: () => {
    set({ messages: [], tokensUsed: 0 });
  },
}));
