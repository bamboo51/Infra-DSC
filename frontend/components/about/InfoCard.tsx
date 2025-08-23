import React from "react";

export interface InfoCardData {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

export default function InfoCard({ title, icon, content }: InfoCardData) {
  return (
    <div className="group">
      <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
        </div>
        <div className="space-y-4">
          {content.map((text, index) => (
            <p key={index} className="text-gray-600 leading-relaxed">
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
