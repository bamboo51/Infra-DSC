import { useEffect, useRef, useState } from "react";
import { ApiService } from "@/services/mlService";
import { CanvasDrawer } from "@/utils/canvasDrawer";
import { PhotoMetadata, PhotoWithResults } from "@/types/api";

export const useAllResults = () => {
  const [photoList, setPhotoList] = useState<PhotoMetadata[]>([]);
  const [activePhotoDetails, setActivePhotoDetails] =
    useState<PhotoWithResults | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(0);

  const [isListLoading, setIsListLoading] = useState<boolean>(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadInitialList = async () => {
      try {
        const data = await ApiService.fetchPhotoList();
        setPhotoList(data.results);
        if (!data.results || data.results.length === 0) {
          setActiveFileIndex(null);
        }
      } catch (err) {
        setError("Failed to load photo list");
      } finally {
        setIsListLoading(false);
      }
    };
    loadInitialList();
  }, []);

  useEffect(() => {
    if (activeFileIndex === null || photoList.length === 0) {
      setActivePhotoDetails(null);
      return;
    }

    const loadActiveDetails = async () => {
      setIsDetailsLoading(true);
      setActivePhotoDetails(null);
      try {
        const photoId = photoList[activeFileIndex].id;
        const details = await ApiService.fetchPhotoDetails(photoId);
        setActivePhotoDetails(details);
      } catch (err) {
        setError("Failed to load photo details");
      } finally {
        setIsDetailsLoading(false);
      }
    };

    loadActiveDetails();
  }, [activeFileIndex, photoList]);

  useEffect(() => {
    const draw = async () => {
      if (!activePhotoDetails || !canvasRef.current) {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      await CanvasDrawer.drawImage(ctx, activePhotoDetails.image);

      if (activePhotoDetails.detections || activePhotoDetails.segmentations) {
        await CanvasDrawer.drawSegmentationMask(
          ctx,
          activePhotoDetails.segmentations || []
        );
        CanvasDrawer.drawDetectionBoxes(
          ctx,
          activePhotoDetails.detections || []
        );
      }

      CanvasDrawer.drawDamageRatio(ctx, activePhotoDetails.crack_ratio);
    };
    draw();
  }, [activePhotoDetails]);

  return {
    allFiles: photoList,
    activeFile: activePhotoDetails,
    activeFileIndex,
    setActiveFileIndex,
    isLoading: isListLoading || isDetailsLoading,
    isListLoading,
    isDetailsLoading,
    error,
    canvasRef,
  };
};
