import React from "react";
import { Dropzone } from "../ui/DropZone";
import { PredictButton} from "../ui/PredictButtonProps";
import { ImageGallery } from "../ui/ImageGallery";
import { SelectedFile, ApiResponse} from "@/types/api";

interface UploadSectionProps {
  processFiles: (files: FileList | null) => void;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handlePredictAll: () => void;
  selectedFiles: SelectedFile[];
  results: Record<number, ApiResponse>;
  activeFileIndex: number | null;
  setActiveFileIndex: (index: number | null) => void;
  allPredicted: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  processFiles,
  isDragging,
  setIsDragging,
  isLoading,
  handlePredictAll,
  selectedFiles,
  results,
  activeFileIndex,
  setActiveFileIndex,
  allPredicted,
}) => {
  return (
    <section className="mb-12 relative">
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="flex items-center mb-8 justify-center">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black">
            検出するための道路画像アプロード
          </h2>
        </div>
        <div className="space-y-6">
          <Dropzone
            processFiles={processFiles}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            disabled={isLoading}
          />
          <div className="flex justify-center">
            <PredictButton
              onClick={handlePredictAll}
              isLoading={isLoading}
              disabled={activeFileIndex === null || allPredicted}
            />
          </div>
          <ImageGallery
            files={selectedFiles}
            results={results}
            activeIndex={activeFileIndex}
            onSelect={setActiveFileIndex}
          />
        </div>
      </div>
    </section>
  );
};