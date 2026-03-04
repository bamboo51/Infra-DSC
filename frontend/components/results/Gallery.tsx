import { memo } from "react";
import { List, X } from "lucide-react";
import { PhotoMetadata } from "@/types/api";

interface GalleryProps {
  files: PhotoMetadata[];
  activeIndex: number | null;
  onSelect: (index: number | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const GalleryComponent: React.FC<GalleryProps> = ({
  files,
  activeIndex,
  onSelect,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (index: number) => {
    onSelect(index);
    if (window.innerWidth >= 768) {
      onToggle();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      <div
        className={`fixed md:relative top-0 left-0 bg-white transition-transform duration-300 z-50 w-72 md:w-56 lg:w-64 shadow-lg md:shadow-none h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <header className="flex items-center justify-between p-2 border border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
              <List className="w-3 h-3 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-black">ギャラリー</h2>
              <p className="text-xs text-gray-600">{files.length} 枚</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="overflow-y-auto custom-scrollbar h-[calc(100%-45px)] p-1">
          {files.map((file, index) => (
            <button
              key={file.id}
              onClick={() => handleSelect(index)}
              className={`w-full p-2 mb-1 rounded-lg transition text-left flex items-center space-x-2 ${
                activeIndex === index
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <img
                src={file.thumbnail}
                alt={`Photo ${file.id}`}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">ID: {file.id}</p>
                <p
                  className={`text-xs ${
                    activeIndex === index ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  検出済み
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export const Gallery = memo(GalleryComponent);