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
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

    const canvas = ctx.canvas;
    canvas.width = img.width;
    canvas.height = img.height;
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
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
      if (!seg.mask_uri) {
        console.warn("Skipping segmentation for class because its mask is missing:", seg.class_name);
        continue; // Skip to the next item in the loop
      }
      const maskImage = new Image();
      maskImage.src = seg.mask_uri;
      await new Promise((resolve, reject) => { maskImage.onload = resolve; maskImage.onerror = reject;});
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
      const [x1, y1, x2, y2] = [det.box_x1, det.box_y1, det.box_x2, det.box_y2];
      const label = `${det.class_name} (${(det.confidence * 100).toFixed(2)}%)`;
      const color =  DETECTION_COLORS.get(det.class_name) || "FFFFFF";

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
  },

  /**
   * Draws the overall damage ratio on the canvas.
   * @param ctx The 2D rendering context for the canvas.
   * @param damageRatio The calculated damage ratio (e.g., 0.123).
   */
  drawDamageRatio(ctx: CanvasRenderingContext2D, damageRatio: number): void {
    const canvas = ctx.canvas;

    const ratioAsPercent = (damageRatio * 100).toFixed(2);
    const label = `Damage Ratio: ${ratioAsPercent}%`;

    const baseSize = Math.min(canvas.width, canvas.height);
    const fontSize = Math.max(24, Math.round(baseSize * 0.035));
    const padding = 10;
    const cornerRadius = 8;
    const position = { x: padding, y: padding }; // Top-left corner

    ctx.font = `bold ${fontSize}px sans-serif`;

    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width;
    const textHeight = fontSize; 
    const rectWidth = textWidth + (padding * 2);
    const rectHeight = textHeight + (padding * 2);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; 
    ctx.beginPath();
    ctx.moveTo(position.x + cornerRadius, position.y);
    ctx.lineTo(position.x + rectWidth - cornerRadius, position.y);
    ctx.quadraticCurveTo(position.x + rectWidth, position.y, position.x + rectWidth, position.y + cornerRadius);
    ctx.lineTo(position.x + rectWidth, position.y + rectHeight - cornerRadius);
    ctx.quadraticCurveTo(position.x + rectWidth, position.y + rectHeight, position.x + rectWidth - cornerRadius, position.y + rectHeight);
    ctx.lineTo(position.x + cornerRadius, position.y + rectHeight);
    ctx.quadraticCurveTo(position.x, position.y + rectHeight, position.x, position.y + rectHeight - cornerRadius);
    ctx.lineTo(position.x, position.y + cornerRadius);
    ctx.quadraticCurveTo(position.x, position.y, position.x + cornerRadius, position.y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(label, position.x + padding, position.y + textHeight + padding / 2);
  }
};
