import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send } from 'lucide-react';
import { useSendMessage } from '@/hooks/use-chat.hook';
import { useChat } from '@/contexts/chat.context';
import { useToast } from '../common/toast.component';
import { useFiles } from '@/hooks/use-files.hook';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const sendMessageMutation = useSendMessage();
  const { addMessage, setTyping } = useChat();
  const { toast } = useToast();
  const { data: files } = useFiles();

  const hasFiles = files && files.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasFiles) return;

    const question = input.trim();
    setInput('');

    // Add user message
    addMessage({ role: 'user', content: question });

    // Set typing indicator
    setTyping(true);

    // Send to API
    sendMessageMutation.mutate(
      { question, topK: 5 },
      {
        onSuccess: (response) => {
          setTyping(false);
          addMessage({
            role: 'assistant',
            content: response.answer,
            sources: response.sources,
          });
        },
        onError: () => {
          setTyping(false);
          toast('Failed to send message', 'error');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasFiles ? "Ask a question..." : "Upload files first..."}
          disabled={!hasFiles || sendMessageMutation.isPending}
          className="resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || !hasFiles || sendMessageMutation.isPending}
          className="h-auto"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

