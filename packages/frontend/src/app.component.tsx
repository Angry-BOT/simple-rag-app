import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query-client';
import { AppProvider } from './contexts/app.context';
import { ChatProvider } from './contexts/chat.context';
import { ToastProvider } from './components/common/toast.component';
import { Header } from './components/layout/header.component';
import { FilesSection } from './components/files/files-section.component';
import { ChatInterface } from './components/chat/chat-interface.component';
import { HistorySidebar } from './components/history/history-sidebar.component';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ChatProvider>
          <ToastProvider>
            <div className="flex flex-col h-screen">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <FilesSection />
                <ChatInterface />
                <HistorySidebar />
              </div>
            </div>
          </ToastProvider>
        </ChatProvider>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

