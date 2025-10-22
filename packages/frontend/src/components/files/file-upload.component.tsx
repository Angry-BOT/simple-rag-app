import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadFile } from '@/hooks/use-files.hook';
import { useToast } from '../common/toast.component';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';

export const FileUpload: React.FC = () => {
  const uploadMutation = useUploadFile();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      uploadMutation.mutate(file, {
        onSuccess: () => toast('File uploaded successfully', 'success'),
        onError: () => toast('Failed to upload file', 'error'),
      });
    });
  }, [uploadMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm font-medium">
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </p>
      <p className="text-xs text-muted-foreground mt-1">or</p>
      <Button variant="outline" className="mt-4" type="button">
        Browse Files
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Supports PDF, TXT, HTML (max 10MB)
      </p>
    </div>
  );
};

