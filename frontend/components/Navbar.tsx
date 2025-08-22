"use client";
import Link from "next/link";
import React, { useState } from "react";

// You can use any icon library or SVG for the icons
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Component for your custom SVG logo
const CustomLogo = () => (
  <div className="w-15 h-15 bg-white rounded-xl flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-black"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 2l-4 20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 2l4 20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M12 2v20"
        strokeDasharray="4 4"
      />
    </svg>
  </div>
);

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: "ホーム", href: "/" },
    { name: "すべての検出結果", href: "/results" },
    { name: "私たちについて", href: "/about" },
    { name: "お問い合わせ", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <CustomLogo />
              </div>
              <div>
                <span className="text-2xl font-bold text-black group-hover:text-gray-700 transition-all duration-300">
                  Infra-DSC
                </span>
                <p className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors duration-300">
                  AIで道路損傷の検出
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group px-4 py-2 rounded-xl text-gray-600 hover:text-black font-medium transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-8 transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 transition-all duration-300 transform hover:scale-105 shadow-sm"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">メインメニューを開く</span>
              <div className="relative w-6 h-6">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group block px-4 py-3 rounded-xl text-gray-600 hover:text-black font-medium transition-all duration-300 transform hover:scale-105 relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <span className="w-2 h-2 bg-black rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
