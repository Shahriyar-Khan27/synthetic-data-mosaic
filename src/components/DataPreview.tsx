
import React from 'react';
import { DataPreviewProps } from '@/lib/types';
import { motion } from 'framer-motion';
import { Table, Database } from 'lucide-react';

const DataPreview: React.FC<DataPreviewProps> = ({ data, fileSize }) => {
  if (!data || data.length === 0) return null;

  // Get the keys (column names) from the first data item
  const columns = Object.keys(data[0]);
  
  // Take only the first 5 rows for preview
  const previewData = data.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-5xl mx-auto mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-1 rounded">
            <Table className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-medium">Data Preview</h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>File Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <motion.th 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="whitespace-nowrap"
                >
                  {column}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * rowIndex, duration: 0.3 }}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="whitespace-nowrap truncate max-w-xs">
                    {row[column]?.toString() || ''}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-right text-xs text-muted-foreground">
        Showing first 5 rows of {data.length} total rows
      </div>
    </motion.div>
  );
};

export default DataPreview;
