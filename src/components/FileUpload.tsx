
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileUploadProps } from '@/lib/types';
import { Upload, FileType, X, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, isUploading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if it's a CSV file
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Check file size (max 1GB)
    const MAX_SIZE = 1_073_741_824; // 1GB in bytes
    if (file.size > MAX_SIZE) {
      toast.error(`File too large! Max size is ${MAX_SIZE / (1024 * 1024)} MB`);
      return;
    }

    setFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        if (!csvData) {
          toast.error('Empty file');
          return;
        }
        
        // Parse CSV to JSON (simplified version)
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const jsonData = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',');
          const row: Record<string, any> = {};
          
          for (let j = 0; j < headers.length; j++) {
            const value = values[j]?.trim() || '';
            // Try to convert to number if possible
            row[headers[j].trim()] = isNaN(Number(value)) ? value : Number(value);
          }
          
          jsonData.push(row);
        }
        
        onFileUploaded(jsonData, file.size);
      } catch (error) {
        console.error(error);
        toast.error('Failed to parse CSV data');
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      {!file ? (
        <div
          className={`file-drop-zone rounded-xl border-2 border-dashed p-10 text-center ${
            isDragging ? 'active' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="bg-primary/10 p-4 rounded-full">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium">Upload your dataset</h3>
            <p className="text-muted-foreground max-w-md">
              Drag and drop your CSV file here, or click to browse
            </p>
            <span className="text-xs text-muted-foreground">Max file size: 1GB</span>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              variant="outline"
            >
              <FileType className="mr-2 h-4 w-4" />
              Select CSV File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv"
              className="hidden"
            />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-secondary rounded-xl p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={removeFile}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
