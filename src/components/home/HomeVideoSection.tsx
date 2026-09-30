"use client";

import React from "react";

export default function HomeVideoSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-golden-500/30 bg-black shadow-2xl">
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src="https://player.mediadelivery.net/embed/766057/915f0d1a-c8f5-4858-9756-addb7283fd16?autoplay=true&loop=false&muted=true&preload=true&responsive=true"
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
