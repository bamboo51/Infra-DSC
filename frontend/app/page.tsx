"use client";

import { useState, useRef } from 'react';
import axios from 'axios';

const COLORS = ['#FF3838', '#FF9D97', '#FF701F', '#FFB21D', '#CFD231', '#48F90A', '#92CC17', '#3DDB86', '#1A9334', '#00D4BB',
  '#2C99A8', '#00C2FF', '#344593', '#6473FF', '#0018EC', '#8438FF', '#520085', '#CB38FF', '#FF95C8', '#FF37C7'];

interface Prediction {
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  confidence: number;
  class_id: number;
  class_name: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPredictions([]);
    setError('');

    // Create a URL for the image preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview('');
    }
  };

  const handlePredict = async () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPredictions([]);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // The API endpoint on Django server
      const response = await axios.post<Prediction[]>('http://127.0.0.1:8000/api/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Predictions:', response.data);
      const newPredictions = response.data?.predictions || [];
      setPredictions(newPredictions);
      drawPredictions(newPredictions);

    } catch (err) {
      setError('Failed to get prediction. Is the backend server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const drawPredictions = (preds: Prediction[]) => {
    const canvas = canvasRef.current;
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      if (canvas) {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Draw the original image on the canvas
          ctx.drawImage(img, 0, 0);
          const baseSize = Math.min(img.width, img.height);
          const fontSize = Math.max(20, Math.round(baseSize * 0.03));
          const lineWidth = Math.max(4, Math.round(baseSize * 0.008));

          // Draw each bounding box
          preds.forEach(pred => {
            const [x1, y1, x2, y2] = pred.box;
            const label = `${pred.class_name} (${(pred.confidence * 100).toFixed(2)}%)`;

            // Styling the box and text
            const color = COLORS[pred.class_id % COLORS.length];
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.font = `bold ${fontSize}px Arial`;

            // Draw the rectangle
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

            // Draw the label background
            ctx.fillStyle = color + "B3";
            const textMetrics = ctx.measureText(label);
            const textWidth = textMetrics.width;
            const textHeight = fontSize;
            const padding = textHeight * 0.25;
            ctx.fillRect(
              x1 - (lineWidth / 2), // Start at the box's edge
              y1 - textHeight - padding, // Position above the box
              textWidth + padding, // Width adapts to text
              textHeight + padding // Height adapts to text
            );

            // Draw the label text
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(
              label,
              x1 + (padding / 2),
              y1 - (padding / 2)
            );
          });
        }
      }
    };
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Infra-DSC crack detection</h1>

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
            {isLoading ? 'Detecting...' : 'Detect Objects'}
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        <div className="mt-8 w-full flex justify-center">
          {imagePreview && (
            <div className="relative">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}