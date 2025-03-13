import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Components
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import ModelSelector from '@/components/ModelSelector';
import SyntheticData from '@/components/SyntheticData';

// Types
import { ModelType } from '@/lib/types';

const Index = () => {
  const [data, setData] = useState<Array<Record<string, any>> | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [modelType, setModelType] = useState<ModelType>('CTGAN');
  const [numSamples, setNumSamples] = useState<number>(100);
  const [epochs, setEpochs] = useState<number>(200);
  const [batchSize, setBatchSize] = useState<number>(500);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [syntheticData, setSyntheticData] = useState<Array<Record<string, any>> | null>(null);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [discreteColumns, setDiscreteColumns] = useState<string[]>([]);

  // Update available columns when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      setAvailableColumns(columns);
      
      // Auto-detect string columns as discrete
      const stringColumns = columns.filter(column => 
        data.some(row => typeof row[column] === 'string')
      );
      setDiscreteColumns(stringColumns);
    }
  }, [data]);

  const handleFileUploaded = (parsedData: Array<Record<string, any>>, size: number) => {
    setIsUploading(true);
    try {
      setData(parsedData);
      setFileSize(size);
      toast.success('Data loaded successfully!');
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      toast.error('Failed to process data');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectModel = (model: string) => {
    setModelType(model as ModelType);
  };

  const handleSetSamples = (samples: number) => {
    setNumSamples(samples);
  };

  const handleSetEpochs = (epochs: number) => {
    setEpochs(epochs);
  };

  const handleSetBatchSize = (batchSize: number) => {
    setBatchSize(batchSize);
  };

  const handleSelectDiscreteColumns = (columns: string[]) => {
    setDiscreteColumns(columns);
  };

  const generateSyntheticData = () => {
    if (!data || data.length === 0) {
      toast.error('Please upload data first');
      return;
    }

    setIsGenerating(true);
    setSyntheticData(null);

    // Simulate model training and generation with a realistic delay
    // In a real app, this would be an API call to a backend service
    setTimeout(() => {
      try {
        // This is just a mock implementation that creates synthetic data
        // by shuffling and transforming the original data
        
        const shuffledData = [...data];
        // Fisher-Yates shuffle
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
        }
        
        // Create synthetic data by transforming values slightly
        const synthetic = [];
        const numRows = Math.min(numSamples, 1000); // Cap at 1000 rows for demo
        
        for (let i = 0; i < numRows; i++) {
          const baseRow = shuffledData[i % shuffledData.length];
          const syntheticRow: Record<string, any> = {};
          
          // For each column, modify the value based on its type
          Object.keys(baseRow).forEach(col => {
            const value = baseRow[col];
            
            if (discreteColumns.includes(col)) {
              // For discrete columns, keep the value as is
              syntheticRow[col] = value;
            } else if (typeof value === 'number') {
              // For numeric columns, add some random noise
              const noise = (Math.random() - 0.5) * 0.2 * Math.abs(value || 1);
              syntheticRow[col] = Math.max(0, value + noise);
            } else {
              syntheticRow[col] = value;
            }
          });
          
          synthetic.push(syntheticRow);
        }
        
        setSyntheticData(synthetic);
        toast.success('Synthetic data generated successfully!');
      } catch (error) {
        console.error('Error generating synthetic data:', error);
        toast.error('Failed to generate synthetic data');
      } finally {
        setIsGenerating(false);
      }
    }, 2000); // Simulate processing time
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <motion.main
        className="flex-1 flex flex-col items-center px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {!data && (
            <motion.div 
              className="max-w-2xl mx-auto text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-4xl font-bold tracking-tight mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Synthetic Data Mosaic
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Create realistic synthetic data from your CSV files using advanced machine learning models
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <FileUpload onFileUploaded={handleFileUploaded} isUploading={isUploading} />
        
        <AnimatePresence>
          {data && (
            <>
              <DataPreview data={data} fileSize={fileSize} />
              
              <ModelSelector
                onSelectModel={handleSelectModel}
                onSetSamples={handleSetSamples}
                onSetEpochs={handleSetEpochs}
                onSetBatchSize={handleSetBatchSize}
                onSelectDiscreteColumns={handleSelectDiscreteColumns}
                availableColumns={availableColumns}
                discreteColumns={discreteColumns}
                isGenerating={isGenerating}
                onGenerate={generateSyntheticData}
              />
            </>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {syntheticData && (
            <SyntheticData data={syntheticData} modelType={modelType} />
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default Index;
