
import React, { useRef } from 'react';
import { SyntheticDataProps } from '@/lib/types';
import { motion } from 'framer-motion';
import { Database, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SyntheticData: React.FC<SyntheticDataProps> = ({ data, modelType }) => {
  const downloadRef = useRef<HTMLAnchorElement>(null);

  if (!data || data.length === 0) return null;

  // Get the keys (column names) from the first data item
  const columns = Object.keys(data[0]);
  
  // Take only the first 10 rows for display
  const displayData = data.slice(0, 10);

  const handleDownload = () => {
    if (!data) return;

    try {
      // Convert data to CSV
      const csvHeader = columns.join(',');
      const csvRows = data.map(row => 
        columns.map(col => {
          const value = row[col];
          // Handle values that need quoting (contain commas, quotes, or are strings)
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      );
      const csvString = [csvHeader, ...csvRows].join('\n');
      
      // Create a blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      if (downloadRef.current) {
        downloadRef.current.href = url;
        downloadRef.current.download = `synthetic_${modelType.toLowerCase()}_data.csv`;
        downloadRef.current.click();
      }
      
      toast.success('Synthetic data downloaded successfully!');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mt-10 mb-20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
            className="bg-accent/20 p-2 rounded-full"
          >
            <CheckCircle2 className="h-6 w-6 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-xl font-medium">Synthetic Data Generated</h2>
            <p className="text-sm text-muted-foreground">Model: {modelType} • {data.length} rows</p>
          </div>
        </div>
        
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
        <a ref={downloadRef} className="hidden"></a>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="border rounded-lg overflow-auto mt-6"
      >
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
            {displayData.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * rowIndex, duration: 0.3 }}
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
      </motion.div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          Showing first 10 rows of {data.length} total rows
        </div>
        
        <div className="text-xs text-muted-foreground italic">
          Note: This is synthetic data, not real. Be careful with usage.
        </div>
      </div>
    </motion.div>
  );
};

export default SyntheticData;
