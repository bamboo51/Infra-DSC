interface ResultDisplayProps {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	error: string;
	hasActiveImage: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ canvasRef, error, hasActiveImage }) => (
	<div className="mt-8 w-full flex flex-col items-center">
		{error && <p className="text-red-500 mb-4">{error}</p>}
		{hasActiveImage && (
			<div className="relative w-full max-w-4xl border-2 border-gray-600 rounded-lg overflow-hidden">
				<canvas
					ref={canvasRef}
					className="max-w-full h-auto rounded-lg"
				/>
			</div>
		)}
	</div>
);