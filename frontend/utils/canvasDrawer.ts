import { DETECTION_COLORS } from "@/constants/constant";
import { Detection, Segmentation } from "@/types/api";

export const CanvasDrawer = {

  /**
   * Draws the initial image on the canvas
   * @param ctx: The 2D rendering context for the canvas
   * @param imagePreview: The base64 string of the image to be drawn
   * @return A promise that resolves with loaded HTMLImageElement
   */

  async drawImage(ctx: CanvasRenderingContext2D, imagePreview: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = imagePreview;
    await new Promise((resolve) => { img.onload = resolve; });

    const canvas = ctx.canvas;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return img;
  },

  /**
   * Draws the segmentation mask on the canvas
   * @param ctx The 2D rendering context for the canvas
   * @param segmentation The segmentation data to be drawn
   */
  async drawSegmentationMask(ctx: CanvasRenderingContext2D, segmentation: Segmentation[]): Promise<void> {
    for (const seg of segmentation) {
      const maskImage = new Image();
      maskImage.src = seg.mask;
      await new Promise((resolve) => { maskImage.onload = resolve; });
      ctx.drawImage(maskImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  },

  /**
   * Draws the detection boxes on the canvas
   * @param ctx The 2D rendering context for the canvas
   * @param detections The detection data to be drawn
   */
  drawDetectionBoxes(ctx: CanvasRenderingContext2D, detections: Detection[]): void {
    const canvas = ctx.canvas;
    const baseSize = Math.min(canvas.width, canvas.height);
    const fontSize = Math.max(20, Math.round(baseSize * 0.03));
    const lineWidth = Math.max(2, Math.round(baseSize * 0.008));

    detections.forEach(det => {
      const [x1, y1, x2, y2] = det.box;
      const label = `${det.class_name} (${(det.confidence * 100).toFixed(2)}%)`;
      const color = DETECTION_COLORS[det.class_id % DETECTION_COLORS.length];

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.font = `bold ${fontSize}px sans-serif`;
      const textMetrics = ctx.measureText(label);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      const padding = 5;

      let labelX = x1;
      let labelY = y1 - textHeight - padding * 2;

      // Adjust label position to stay within canvas bounds
      if (labelY < 0) {
        labelY = y1 + padding;
      }
      if (labelX + textWidth + padding * 2 > canvas.width) {
        labelX = canvas.width - textWidth - padding * 2;
      }

      // Background rect
      ctx.fillStyle = color;
      ctx.fillRect(labelX, labelY, textWidth + padding * 2, textHeight + padding * 2);

      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, labelX + padding, labelY + textHeight + padding / 2);
    });
  }
};
