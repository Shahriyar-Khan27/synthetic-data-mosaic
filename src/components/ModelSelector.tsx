
import React, { useState } from 'react';
import { ModelSelectorProps } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Settings2,
  Play,
  Brain,
  BarChart3,
  Network,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const ModelSelector: React.FC<ModelSelectorProps> = ({
  onSelectModel,
  onSetSamples,
  onSetEpochs,
  onSetBatchSize,
  onSelectDiscreteColumns,
  availableColumns,
  discreteColumns,
  isGenerating,
  onGenerate,
}) => {
  const [modelType, setModelType] = useState<string>('CTGAN');
  const [numSamples, setNumSamples] = useState<number>(100);
  const [epochs, setEpochs] = useState<number>(200);
  const [batchSize, setBatchSize] = useState<number>(500);
  const [selectedDiscreteColumns, setSelectedDiscreteColumns] = useState<string[]>(discreteColumns);

  const handleModelChange = (value: string) => {
    setModelType(value);
    onSelectModel(value);
  };

  const handleNumSamplesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setNumSamples(value);
      onSetSamples(value);
    }
  };

  const handleEpochsChange = (value: number[]) => {
    setEpochs(value[0]);
    onSetEpochs(value[0]);
  };

  const handleBatchSizeChange = (value: number[]) => {
    setBatchSize(value[0]);
    onSetBatchSize(value[0]);
  };

  const handleDiscreteColumnToggle = (column: string, checked: boolean) => {
    let updatedColumns;
    if (checked) {
      updatedColumns = [...selectedDiscreteColumns, column];
    } else {
      updatedColumns = selectedDiscreteColumns.filter(col => col !== column);
    }
    setSelectedDiscreteColumns(updatedColumns);
    onSelectDiscreteColumns(updatedColumns);
  };

  const getModelIcon = (model: string) => {
    switch (model) {
      case 'CTGAN':
        return <Network className="h-5 w-5" />;
      case 'TVAE':
        return <Brain className="h-5 w-5" />;
      case 'GaussianCopula':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Network className="h-5 w-5" />;
    }
  };

  const modelOptions = [
    {
      id: 'CTGAN',
      name: 'CTGAN',
      description: 'Best for mixed data with 1000+ rows.',
      icon: <Network className="h-6 w-6" />,
    },
    {
      id: 'TVAE',
      name: 'TVAE',
      description: 'Better with numeric-heavy data.',
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: 'GaussianCopula',
      name: 'Gaussian Copula',
      description: 'Works best with Gaussian-like data.',
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-5xl mx-auto mt-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-secondary p-1 rounded">
          <Settings2 className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Model Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modelOptions.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="hover-card"
          >
            <Card 
              className={`h-full cursor-pointer transition-all ${
                modelType === model.id ? 'border-primary/50 shadow-md' : ''
              }`}
              onClick={() => handleModelChange(model.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-full bg-secondary">
                    {model.icon}
                  </div>
                  {modelType === model.id && (
                    <div className="h-2 w-2 rounded-full bg-primary"/>
                  )}
                </div>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Samples</label>
              <Input
                type="number"
                min="1"
                value={numSamples}
                onChange={handleNumSamplesChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Epochs: {epochs}</label>
              </div>
              <Slider
                defaultValue={[epochs]}
                max={500}
                min={10}
                step={10}
                onValueChange={handleEpochsChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Batch Size: {batchSize}</label>
              </div>
              <Slider
                defaultValue={[batchSize]}
                max={1000}
                min={100}
                step={50}
                onValueChange={handleBatchSizeChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Discrete Columns</CardTitle>
            <CardDescription>Select columns to treat as categorical</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[200px] overflow-y-auto pr-2">
              {availableColumns.map((column) => (
                <div key={column} className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id={`column-${column}`}
                    checked={selectedDiscreteColumns.includes(column)}
                    onCheckedChange={(checked) => 
                      handleDiscreteColumnToggle(column, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`column-${column}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={onGenerate}
            disabled={isGenerating} 
            className="px-8 py-6 text-base"
          >
            <Play className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Synthetic Data'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelSelector;
