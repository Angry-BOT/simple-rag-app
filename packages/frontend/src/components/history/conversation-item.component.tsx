import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useChat } from '@/contexts/chat.context';
import type { Conversation } from '@/types/chat.types';
import { formatRelativeTime } from '@/utils/format.util';

interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
  const { state, selectConversation, deleteConversation } = useChat();
  const isActive = state.currentConversationId === conversation.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteConversation(conversation.id);
    }
  };

  return (
    <Card
      className={`p-3 cursor-pointer hover:shadow-md transition-all ${
        isActive ? 'border-primary bg-primary/5' : ''
      }`}
      onClick={() => selectConversation(conversation.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{conversation.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {conversation.messages.length} messages
          </p>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(conversation.updatedAt)}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          className="h-8 w-8"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};

