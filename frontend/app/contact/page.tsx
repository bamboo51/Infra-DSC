"use client";

import React from "react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-100 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full filter blur-xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-50 rounded-full filter blur-xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 relative">
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full mb-4 sm:mb-6 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-black font-semibold mb-3 sm:mb-4">
              お気軽にお問い合わせください
            </p>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              インフラ点検に関するご質問やご相談がございましたら、お気軽にご連絡ください。
            </p>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">連絡先情報</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Email */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2 text-base sm:text-lg">メール</h3>
                <a 
                  href="mailto:contact@infra-dsc.com"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm sm:text-base break-all"
                >
                  contact@infra-dsc.net
                </a>
              </div>

              {/* Phone */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2 text-base sm:text-lg">電話</h3>
                <a 
                  href="tel:03-1234-5678"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm sm:text-base"
                >
                  03-1234-5678
                </a>
              </div>

              {/* Address */}
              <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-7 sm:w-7 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2 text-base sm:text-lg">住所</h3>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  <p>〒989-3128</p>
                  <p>宮城県仙台市青葉区中央4-16-1</p>
                  <p className="font-medium">仙台高専</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for mobile optimizations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          /* Ensure touch targets are at least 44px */
          a, button {
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Prevent zoom on input focus on iOS */
          input, select, textarea, button {
            font-size: 16px;
          }
        }
        
        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:shadow-md:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
        }
      `}</style>
    </main>
  );
}
