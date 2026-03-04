import React from 'react';
import Link from 'next/link';

export interface CtaButtonData {
  href: string;
  text: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary';
}

interface CallToActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttons: CtaButtonData[];
}

const CtaButton: React.FC<CtaButtonData> = ({ href, text, icon, variant }) => {
  const baseClasses = "group inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl";
  const variantClasses = variant === 'primary'
    ? "bg-white text-blue-600 hover:bg-gray-100"
    : "border-2 border-white text-white hover:bg-white hover:text-blue-600";
  
  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {icon}
      {text}
    </Link>
  );
};

const CallToAction: React.FC<CallToActionProps> = ({ icon, title, description, buttons }) => (
  <section className="text-center mb-16">
    <div className="max-w-7xl mx-auto relative">
      <div className="relative bg-black rounded-3xl p-12 shadow-xl border border-gray-200">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
            {icon}
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          {title}
        </h3>
        <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {buttons.map((button) => (
            <CtaButton key={button.href} {...button} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CallToAction;