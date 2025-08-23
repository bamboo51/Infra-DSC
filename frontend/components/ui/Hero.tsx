import React from "react";

export interface HeroData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

const Hero: React.FC<HeroData> = ({ icon, title, subtitle, description }) => (
  <div className="text-center mb-20 relative">
    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-xl">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-lg">
          {icon}
        </div>
      </div>
      <h1 className="text-6xl md:text-4xl font-bold mb-8 text-black">
        {title}
      </h1>
      <div className="space-y-4 max-w-3xl mx-auto">
        <p className="text-2xl text-gray-800 font-semibold">
          {subtitle}
        </p>
        <p className="text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default Hero;
