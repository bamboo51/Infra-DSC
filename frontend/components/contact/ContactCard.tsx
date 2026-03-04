import React from 'react';

export interface ContactCardData {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const ContactCard: React.FC<ContactCardData> = ({ title, icon, content }) => (
  <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-black mb-2 text-base sm:text-lg">{title}</h3>
    {content}
  </div>
);

export default ContactCard;