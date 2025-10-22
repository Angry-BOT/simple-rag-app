import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText, Trash2, PlayCircle } from 'lucide-react';
import { useDeleteFile, useProcessFile } from '@/hooks/use-files.hook';
import { useToast } from '../common/toast.component';
import type { FileResponse } from '@/types/file.types';
import { formatFileSize, formatRelativeTime } from '@/utils/format.util';

interface FileItemProps {
  file: FileResponse;
}

export const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const deleteMutation = useDeleteFile();
  const processMutation = useProcessFile();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = () => {
    if (confirm(`Delete ${file.originalName}?`)) {
      deleteMutation.mutate(file.id, {
        onSuccess: () => toast('File deleted', 'success'),
        onError: () => toast('Failed to delete file', 'error'),
      });
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    processMutation.mutate(file.id, {
      onSuccess: () => {
        toast('File processed successfully', 'success');
        setIsProcessing(false);
      },
      onError: () => {
        toast('Failed to process file', 'error');
        setIsProcessing(false);
      },
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{file.originalName}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(file.size)} • {formatRelativeTime(file.uploadedAt)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {file.fileType.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleProcess}
            disabled={isProcessing || processMutation.isPending}
            title="Process file"
          >
            <PlayCircle className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Delete file"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

