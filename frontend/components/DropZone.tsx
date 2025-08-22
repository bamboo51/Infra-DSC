import { useRef } from "react";

interface DropzoneProps {
	processFiles: (files: FileList | null) => void;
	isDragging: boolean;
	setIsDragging: (isDragging: boolean) => void;
	disabled: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ processFiles, isDragging, setIsDragging, disabled }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragIn = (event: React.DragEvent<HTMLDivElement>) => {
		handleDrag(event);
		if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	};

	const handleDragOut = (event: React.DragEvent<HTMLDivElement>) => {
		handleDrag(event);
		setIsDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		handleDrag(event);
		setIsDragging(false);
		if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
			processFiles(event.dataTransfer.files);
			event.dataTransfer.clearData();
		}
	};

	const onButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div
			className={`relative w-full p-12 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group ${
				isDragging 
					? 'border-black bg-gray-100 shadow-lg' 
					: 'border-gray-300 hover:border-black hover:bg-gray-50'
			} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
			onDragEnter={handleDragIn}
			onDragLeave={handleDragOut}
			onDragOver={handleDrag}
			onDrop={handleDrop}
			onClick={onButtonClick}
		>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={(event) => processFiles(event.target.files)}
				className="hidden"
				disabled={disabled}
			/>
			<div className="flex flex-col items-center justify-center text-center">
				<div className={`w-16 h-16 mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
					isDragging 
						? 'bg-black shadow-lg' 
						: 'bg-black group-hover:scale-110'
				}`}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
				</div>
				<h3 className="text-xl font-semibold text-black mb-3 group-hover:text-gray-700 transition-colors duration-300">
					{isDragging ? 'Drop your images here' : 'Upload Infrastructure Images'}
				</h3>
				<p className="text-gray-600 mb-4 leading-relaxed">
					Drag & drop your files here, or{' '}
					<span className="text-black font-semibold group-hover:text-gray-700 transition-colors duration-300">
						click to browse
					</span>
				</p>
				<p className="text-sm text-gray-500">
					Supports: JPG, PNG, GIF • Multiple files allowed
				</p>
			</div>
		</div>
	);
};