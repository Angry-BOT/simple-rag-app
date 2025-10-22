import React from 'react';
import { useFiles } from '@/hooks/use-files.hook';
import { FileItem } from './file-item.component';
import { Loading } from '../common/loading.component';
import { EmptyState } from '../common/empty-state.component';

export const FileList: React.FC = () => {
  const { data: files, isLoading, error } = useFiles();

  if (isLoading) return <Loading message="Loading files..." />;
  if (error) return <div className="text-sm text-destructive p-4">Failed to load files</div>;
  if (!files || files.length === 0) {
    return <EmptyState title="No files uploaded" description="Upload a file to get started" />;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold px-1">Uploaded Files ({files.length})</h3>
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
};

