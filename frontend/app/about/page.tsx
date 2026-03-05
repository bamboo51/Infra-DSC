"use client";

import React from "react";
import Hero from "@/components/ui/Hero";
import TitledSection from "@/components/ui/TitledSection";
import InfoCard from "@/components/about/InfoCard";
import Timeline from "@/components/about/Timeline";
import CallToAction from "@/components/about/CallToAction";
import BackgroundBlobs from "@/components/ui/BackgroundBlobs";

import { backgroundSection, journeySection, ctaSection, heroData } from "@/data/about"

export default function About() {
  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden">
      <BackgroundBlobs />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Hero {...heroData} />

        {/* Background Section */}
        <TitledSection title={backgroundSection.title} icon={backgroundSection.icon}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {backgroundSection.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </TitledSection>

        {/* Development History Section */}
        {/*
        <TitledSection title={journeySection.title} icon={journeySection.icon}>
          <Timeline items={journeySection.timeline} />
        </TitledSection>
        */}

        {/* Call to Action */}
        <CallToAction {...ctaSection} />
      </div>
    </main>
  );
}