import { PhotoWithResults } from "@/types/api";
import { useEffect, useRef, useState } from "react";
import { fetchPhotoFromDB } from "@/services/mlService";
import { CanvasDrawer } from "@/utils/canvasDrawer";

export const useAllResults = () => {
  const [allFiles, setAllFiles] = useState<PhotoWithResults[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPhotoFromDB();
        console.log("data:", data);
        setAllFiles(data || []);
        if (data && data.length > 0) {
          setActiveFileIndex(0);
        }
      } catch (err) {
        setError("Failed to fetch data from the server.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const drawActiveFile = async () => {
      const activeFile =
        activeFileIndex !== null ? allFiles[activeFileIndex] : null;

      // Check for the canvas and the active file itself
      if (activeFile && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        await CanvasDrawer.drawImage(ctx, activeFile.image);

        if (activeFile.detections || activeFile.segmentations) {
            await CanvasDrawer.drawSegmentationMask(ctx, activeFile.segmentations || []);
            CanvasDrawer.drawDetectionBoxes(ctx, activeFile.detections || []);
        }
      }
    };

    drawActiveFile();
  }, [activeFileIndex, allFiles]);

  return {
    allFiles,
    activeFileIndex,
    setActiveFileIndex,
    isLoading,
    error,
    canvasRef,
  };
};
