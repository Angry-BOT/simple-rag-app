import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, type ReactNode } from 'react';
import type { Message, Conversation } from '../types/chat.types';

/**
 * Chat state interface
 */
interface ChatState {
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string | null;
  isTyping: boolean;
}

/**
 * Chat actions
 */
type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'NEW_CONVERSATION' }
  | { type: 'SELECT_CONVERSATION'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'LOAD_CONVERSATIONS'; payload: Conversation[] };

/**
 * Chat context interface
 */
interface ChatContextType {
  state: ChatState;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  newConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  setTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'rag-app-conversations';

/**
 * Chat reducer function
 */
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessages = [...state.messages, action.payload];
      
      // Update current conversation
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === state.currentConversationId) {
          return {
            ...conv,
            messages: newMessages,
            updatedAt: new Date(),
            // Update title from first user message if not set
            title: conv.title === 'New Conversation' && action.payload.role === 'user'
              ? action.payload.content.substring(0, 50)
              : conv.title,
          };
        }
        return conv;
      });

      return {
        ...state,
        messages: newMessages,
        conversations: updatedConversations,
      };
    }

    case 'NEW_CONVERSATION': {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...state,
        messages: [],
        conversations: [newConv, ...state.conversations],
        currentConversationId: newConv.id,
      };
    }

    case 'SELECT_CONVERSATION': {
      const selected = state.conversations.find((c) => c.id === action.payload);
      return {
        ...state,
        messages: selected?.messages || [],
        currentConversationId: action.payload,
      };
    }

    case 'DELETE_CONVERSATION': {
      const filtered = state.conversations.filter((c) => c.id !== action.payload);
      const wasCurrentDeleted = state.currentConversationId === action.payload;

      return {
        ...state,
        conversations: filtered,
        currentConversationId: wasCurrentDeleted ? (filtered[0]?.id || null) : state.currentConversationId,
        messages: wasCurrentDeleted ? (filtered[0]?.messages || []) : state.messages,
      };
    }

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload };

    case 'LOAD_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
        currentConversationId: action.payload[0]?.id || null,
        messages: action.payload[0]?.messages || [],
      };

    default:
      return state;
  }
};

/**
 * Initial state with one default conversation
 */
const initialState: ChatState = {
  messages: [],
  conversations: [
    {
      id: `conv_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  currentConversationId: null,
  isTyping: false,
};

/**
 * Chat Provider Component
 */
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const conversations = JSON.parse(stored) as Conversation[];
        // Convert date strings back to Date objects
        const parsedConversations = conversations.map((conv) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        dispatch({ type: 'LOAD_CONVERSATIONS', payload: parsedConversations });
      } catch (error) {
        console.error('Failed to load conversations from localStorage:', error);
      }
    } else {
      // Set initial conversation as current
      dispatch({ type: 'SELECT_CONVERSATION', payload: initialState.conversations[0].id });
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (state.conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
    }
  }, [state.conversations]);

  // Memoized action creators
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const fullMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: fullMessage });
  }, []);

  const newConversation = useCallback(() => {
    dispatch({ type: 'NEW_CONVERSATION' });
  }, []);

  const selectConversation = useCallback((id: string) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: id });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: id });
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      addMessage,
      newConversation,
      selectConversation,
      deleteConversation,
      setTyping,
    }),
    [state, addMessage, newConversation, selectConversation, deleteConversation, setTyping]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/**
 * Custom hook to use Chat context
 */
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

