import { ApiService } from "@/services/mlService";
import { ApiResponse, SelectedFile } from "@/types/api";
import { CanvasDrawer } from "@/utils/canvasDrawer";
import { useEffect, useRef, useState } from "react"
import EXIF from "exif-js";
import { Coords } from "@/types/coords";

export const crackDetection = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, ApiResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeFile = activeFileIndex !== null ? selectedFiles[activeFileIndex] : null;

  const getExifData = (file: File): Promise<Coords | undefined> => {
    return new Promise((resolve) => {
      EXIF.getData(file as any, function(this: any){
        const latitude = EXIF.getTag(this, "GPSLatitude");
        const longitude = EXIF.getTag(this, "GPSLongitude");

        if(Array.isArray(latitude) && Array.isArray(longitude)){
          const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
          const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

          const latDec = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;
          const lonDec = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;

          resolve({
            latitude: latRef === "N" ? latDec : -latDec,
            longitude: lonRef === "E" ? lonDec : -lonDec,
          });
        } else {
          resolve(undefined);
        }
      });
    });
  }

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      setError("");
      const filesArray = Array.from(files).filter(file => file.type.startsWith("image/"));

      if (filesArray.length === 0) {
        setError("No valid image files found.");
        return;
      }

      const filePromises = filesArray.map(async file => {
        const coords = await getExifData(file);
        console.log(coords);
        return new Promise<SelectedFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ file, preview: reader.result as string, coords });
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
      ApiService.predict(file.file, file.coords).then(response => ({ index, response }))
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
        CanvasDrawer.drawDamageRatio(ctx, resultForActiveFile.crack_ratio);
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