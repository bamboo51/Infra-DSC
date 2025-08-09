import { ApiService } from "@/services/mlService";
import { ApiResponse, SelectedFile } from "@/types/api";
import { CanvasDrawer } from "@/utils/canvasDrawer";
import { useCallback, useEffect, useRef, useState } from "react"

export const crackDetection = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, ApiResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeFile = activeFileIndex !== null ? selectedFiles[activeFileIndex] : null;

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      setError("");
      const filesArray = Array.from(files).filter(file => file.type.startsWith("image/"));

      if (filesArray.length === 0) {
        setError("No valid image files found.");
        return;
      }

      const filePromises = filesArray.map(file => {
        return new Promise<SelectedFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ file, preview: reader.result as string });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(newFiles => {
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        if (activeFileIndex === null && updatedFiles.length > 0) {
          setActiveFileIndex(0);
        }
      });
    }
  };


  /**
   * Draw the results on the canvas.
   */
  const drawResults = useCallback(async (data: ApiResponse, imagePreview: string) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    await CanvasDrawer.drawImage(ctx, imagePreview);
    await CanvasDrawer.drawSegmentationMask(ctx, data.segmentation);
    CanvasDrawer.drawDetectionBoxes(ctx, data.detection);
  }, []);

  const handlePredictAll = async () => {
    if (selectedFiles.length === 0) {
      setError("No images selected for prediction.");
      return;
    }
    setIsLoading(true);
    setError("");

    const predictionsToRun = selectedFiles
      .map((file, index) => ({ file, index }))
      .filter(({ index }) => !results[index]);

    if (predictionsToRun.length === 0) {
      setIsLoading(false);
      return;
    }

    const promises = predictionsToRun.map(({ file, index }) =>
      ApiService.predict(file.file).then(response => ({ index, response }))
    );

    const settledResults = await Promise.allSettled(promises);

    const newResults: Record<number, ApiResponse> = {};
    settledResults.forEach(result => {
      if (result.status === 'fulfilled') {
        newResults[result.value.index] = result.value.response;
      } else {
        console.error("A prediction failed:", result.reason);
        setError("One or more predictions failed. Check the console.");
      }
    });

    setResults(prev => ({ ...prev, ...newResults }));
    setIsLoading(false);
  }

  useEffect(() => {
    const drawCanvas = async () => {
      if (!activeFile || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const resultForActiveFile = activeFileIndex !== null ? results[activeFileIndex] : null;

      await CanvasDrawer.drawImage(ctx, activeFile.preview);

      if (resultForActiveFile) {
        await CanvasDrawer.drawSegmentationMask(ctx, resultForActiveFile.segmentation);
        CanvasDrawer.drawDetectionBoxes(ctx, resultForActiveFile.detection);
      }
    };

    drawCanvas();
  }, [activeFile, activeFileIndex, results]);

return {
    selectedFiles,
    activeFileIndex,
    setActiveFileIndex,
    results,
    isLoading,
    isDragging,
    setIsDragging,
    error,
    canvasRef,
    processFiles,
    handlePredictAll,
  };
}