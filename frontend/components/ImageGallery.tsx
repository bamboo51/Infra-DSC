import { SelectedFile } from "@/types/api";
import { ApiResponse } from "@/types/api";

interface ImageGalleryInterface {
	files: SelectedFile[];
	results: Record<number, ApiResponse>;
	activeIndex: number | null;
	onSelect: (index: number | null) => void;
};

export const ImageGallery: React.FC<ImageGalleryInterface> = ({ files, results, activeIndex, onSelect }) => {
	if (files.length === 0) return null;
	return (
    <div className="w-full mt-6">
      <h3 className="text-lg font-semibold mb-2 text-black">Selected Images</h3>
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {files.map((file, index) => (
          <div key={file.file.name + index} className="relative">
            <img
              src={file.preview} alt={file.file.name} onClick={(e) => { e.stopPropagation(); onSelect(index); }}
              className={`w-24 h-24 object-cover rounded-md cursor-pointer transition-all duration-200 ${ index === activeIndex ? 'ring-4 ring-black' : 'ring-2 ring-gray-300 hover:ring-black' }`}
            />
            {results[index] && (
              <div className="absolute top-1 right-1 bg-black rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}