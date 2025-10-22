import React from 'react';
import { FileUpload } from './file-upload.component';
import { FileList } from './file-list.component';

export const FilesSection: React.FC = () => {
  return (
    <div className="w-full lg:w-1/4 h-full border-r bg-background overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Documents</h2>
          <FileUpload />
        </div>
        <FileList />
      </div>
    </div>
  );
};

