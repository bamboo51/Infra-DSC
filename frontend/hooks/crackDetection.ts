import { ApiService } from "@/services/mlService";
import { ApiResponse } from "@/types/api";
import { CanvasDrawer } from "@/utils/canvasDrawer";
import { useCallback, useEffect, useRef, useState } from "react"

export const crackDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Handle file input changes.
   * @param event The change event from the file input.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setResults(null);
    setError("");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setImagePreview(resultStr);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            CanvasDrawer.drawImage(ctx, resultStr);
          }
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  };

  /**
   * Draw the results on the canvas.
   */
  const drawResults = useCallback(async (data: ApiResponse) => {
    if (!imagePreview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await CanvasDrawer.drawImage(ctx, imagePreview);
    await CanvasDrawer.drawSegmentationMask(ctx, data.segmentation);
    await CanvasDrawer.drawDetectionBoxes(ctx, data.detection);
  }, [imagePreview]);

  /**
   * Handle the prediction process.
   * @returns {Promise<void>}
   */
  const handlePredict = async () => {
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResults(null);

    try {
      const responseData = await ApiService.predict(file);
      setResults(responseData);
      await drawResults(responseData);
    } catch (err) {
      setError("An error occurred while processing the image.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imagePreview && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        CanvasDrawer.drawImage(ctx, imagePreview);
      }
    }
  }, [imagePreview]);

  return {
    file,
    results,
    isLoading,
    error,
    imagePreview,
    canvasRef,
    handleFileChange,
    handlePredict,
  };
}