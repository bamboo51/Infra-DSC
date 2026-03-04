import React from "react";

export interface TimelineItemData {
  year: string;
  title: string;
  points: string[];
  isCurrent?: boolean;
}

const TimelineItem: React.FC<TimelineItemData> = ({
  year,
  title,
  points,
  isCurrent,
}) => {
  return (
    <div className="relative flex items-start">
      <div className="absolute left-6 w-4 h-4 bg-black rounded-full border-4 border-white shadow-lg"></div>
      <div className="ml-20 group">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-black mr-4">{year}</span>
            {isCurrent && (
              <span className="text-sm font-semibold text-white bg-gray-600 px-3 py-1 rounded-full">
                Present
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
          <ul className="text-gray-600 space-y-2">
            {points.map((point, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  point.startsWith("🏆") ? "font-bold" : ""
                }`}
              >
                <span className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface TimelineProps {
  items: TimelineItemData[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-black"></div>
      <div className="space-y-12">
        {items.map((item) => (
          <TimelineItem key={item.year} {...item} />
        ))}
      </div>
    </div>
  );
}

