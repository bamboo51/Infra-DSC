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
			className={`relative w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-gray-700/50' : 'border-gray-600 hover:border-blue-400'}`}
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
			<div className="flex flex-col items-center justify-center text-center cursor-pointer">
				<p className="text-gray-400">Drag & drop your files here, or click to upload</p>
			</div>
		</div>
	);
};