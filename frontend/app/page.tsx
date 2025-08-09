"use client";

import { crackDetection } from "@/hooks/crackDetection";
import { FileInput } from "@/components/FileInputProps";
import { PredictButton } from "@/components/PredictButtonProps";
import { ResultDisplay } from "@/components/ResultDisplayProps";

export default function App(){
  const {
    file,
    isLoading,
    error,
    imagePreview,
    canvasRef,
    handleFileChange,
    handlePredict,
  } = crackDetection();

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Infra-DSC Crack Detection
          </h1>
        </header>

        <section className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col items-center">
          <FileInput onChange={handleFileChange} disabled={isLoading} />
          <PredictButton onClick={handlePredict} isLoading={isLoading} disabled={!file} />
        </section>

        <ResultDisplay
          imagePreview={imagePreview}
          canvasRef={canvasRef}
          error={error}
        />
      </div>
    </main>
  );
}