import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble.component';
import { ChatInput } from './chat-input.component';
import { useChat } from '@/contexts/chat.context';
import { EmptyState } from '../common/empty-state.component';

export const ChatInterface: React.FC = () => {
  const { state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold">Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {state.messages.length === 0 ? (
          <EmptyState
            title="Start a conversation"
            description="Upload a document and ask questions to get started"
          />
        ) : (
          <>
            {state.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {state.isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs">🤖</span>
                </div>
                <div className="flex items-center gap-1 p-4 bg-card rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <ChatInput />
    </div>
  );
};

