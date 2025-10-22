import React from 'react';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/contexts/app.context';

export const Header: React.FC = () => {
  const { state, toggleTheme } = useApp();

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h1 className="text-xl font-bold">Simple RAG</h1>
            <p className="text-xs text-muted-foreground">Document Q&A System</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {state.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
};

