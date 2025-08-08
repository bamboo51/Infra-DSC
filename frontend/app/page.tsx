"use client";

import { useState, useRef } from "react";
import axios from "axios";

const DETECTION_COLORS = [
  "#FF3838",
  "#FF9D97",
  "#FF701F",
  "#FFB21D",
  "#CFD231",
  "#48F90A",
];

interface Detection {
  box: [number, number, number, number];
  confidence: number;
  class_id: number;
  class_name: string;
}

interface Segmentation {
  mask: string;
  confidence: number;
  class_id: number;
  class_name: string;
}

interface ApiResponse {
  detection: Detection[];
  segmentation: Segmentation[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setResults(null);
    setError("");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  };

  const drawResults = async (data: ApiResponse) => {
    if (!imagePreview) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imagePreview;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw segmentation masks
    for (const seg of data.segmentation) {
      const maskImage = new Image();
      maskImage.src = seg.mask;
      await new Promise((resolve) => {
        maskImage.onload = resolve;
      });
      ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw detection boxes
    const baseSize = Math.min(canvas.width, canvas.height);
    const fontSize = Math.max(20, Math.round(baseSize * 0.03));
    const lineWidth = Math.max(2, Math.round(baseSize * 0.008));

    data.detection.forEach(det => {
      const [x1, y1, x2, y2] = det.box;
      const label = `${det.class_name} (${(det.confidence * 100).toFixed(2)}%)`;
      const color = DETECTION_COLORS[det.class_id % DETECTION_COLORS.length];

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;
      const padding = textHeight * 0.25;

      let labelX = x1 + padding / 2;
      let labelY = y1 - padding / 2;

      if (labelX < 0) labelX = 0;
      if (labelY - textHeight < 0) labelY = y2 + textHeight; 
      if (labelX + textWidth + padding * 2 > canvas.width) {
        labelX = canvas.width - textWidth - padding * 2;
      }

      ctx.fillStyle = color + "B3";
      ctx.fillRect(labelX - padding, labelY - textHeight, textWidth + padding * 2, textHeight + padding);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, labelX, labelY - padding / 2);
    });
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResults(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post<ApiResponse>(
        "http://127.0.0.1:8000/api/predict/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResults(response.data);
      await drawResults(response.data);
    } catch (err) {
      setError("Failed to get detection. Is the backend server running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          Infra-DSC Crack Detection
        </h1>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 p-2 rounded bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />

          <button
            onClick={handlePredict}
            disabled={isLoading || !file}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            {isLoading ? "Detecting..." : "Detect Objects"}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        <div className="mt-8 w-full flex justify-center">
          {imagePreview && (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
