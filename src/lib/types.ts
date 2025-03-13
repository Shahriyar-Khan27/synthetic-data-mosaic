
export interface DataPreviewProps {
  data: Array<Record<string, any>> | null;
  fileSize: number;
}

export interface ModelSelectorProps {
  onSelectModel: (modelType: string) => void;
  onSetSamples: (samples: number) => void;
  onSetEpochs: (epochs: number) => void;
  onSetBatchSize: (batchSize: number) => void;
  onSelectDiscreteColumns: (columns: string[]) => void;
  availableColumns: string[];
  discreteColumns: string[];
  isGenerating: boolean;
  onGenerate: () => void;
}

export interface FileUploadProps {
  onFileUploaded: (data: Array<Record<string, any>>, fileSize: number) => void;
  isUploading: boolean;
}

export interface SyntheticDataProps {
  data: Array<Record<string, any>> | null;
  modelType: string;
}

export type ModelType = 'CTGAN' | 'TVAE' | 'GaussianCopula';
