import React from 'react';
import { Button } from '../ui/button';
import { ConversationItem } from './conversation-item.component';
import { useChat } from '@/contexts/chat.context';
import { Plus } from 'lucide-react';
import { EmptyState } from '../common/empty-state.component';

export const HistorySidebar: React.FC = () => {
  const { state, newConversation } = useChat();

  return (
    <div className="w-full lg:w-1/4 h-full border-l bg-background overflow-y-auto">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">History</h2>
          <Button size="icon" onClick={newConversation} title="New conversation">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {state.conversations.length === 0 ? (
          <EmptyState
            title="No conversations"
            description="Start chatting to create a conversation"
          />
        ) : (
          <div className="space-y-3">
            {state.conversations.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

