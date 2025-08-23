"use client";

import React from "react";
import BackgroundBlobs from "@/components/ui/BackgroundBlobs";
import Hero from "@/components/ui/Hero";
import ContactCard from "@/components/contact/ContactCard";
import TitledSection from "@/components/ui/TitledSection";
import { heroData, contactSectionData } from "@/data/contact";


export default function Contact() {
  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">
      <BackgroundBlobs />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Hero {...heroData} />

        {/* Contact Information Section */}
        <TitledSection
          title={contactSectionData.title}
          icon={contactSectionData.icon}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {contactSectionData.cards.map((card) => (
              <ContactCard
                key={card.title}
                title={card.title}
                icon={card.icon}
                content={card.content}
              />
            ))}
          </div>
        </TitledSection>

        {/* Custom CSS for mobile optimizations */}
      </div>
      <style jsx>{`
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          /* Ensure touch targets are at least 44px */
          a,
          button {
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        /* Touch-friendly improvements */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:shadow-md:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
        }
      `}</style>
    </main>
  );
}
