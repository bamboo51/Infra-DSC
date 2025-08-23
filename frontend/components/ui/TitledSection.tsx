import React from "react";

export interface TitledSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const TitledSection: React.FC<TitledSectionProps> = ({ title, icon, children }) => {
  return (
    <section className="mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-12 justify-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-black">{title}</h2>
        </div>
        <div className="relative">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-200">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TitledSection;