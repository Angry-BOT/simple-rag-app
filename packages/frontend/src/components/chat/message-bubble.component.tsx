import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Message } from '@/types/chat.types';
import { formatTime } from '@/utils/format.util';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`flex-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-4 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {message.sources.map((source, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  📄 {source.fileName}
                </Badge>
              ))}
            </div>
          )}
        </Card>
        <p className="text-xs text-muted-foreground mt-1 px-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

