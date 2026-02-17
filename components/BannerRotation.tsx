"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type BannerProps = {
  mode: "adsense" | "affiliate"; // <--- CONTROL SWITCH
  
  // AdSense Config
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  responsive?: string;

  // Affiliate Config
  affiliateLink?: string;
  affiliateImage?: string;
  affiliateAlt?: string;

  label?: string;
};

export function BannerRotator({ 
  mode, 
  slot, 
  format = "auto", 
  responsive = "true",
  affiliateLink,
  affiliateImage,
  affiliateAlt = "Special Offer",
  label = "Sponsored"
}: BannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (window.location.hostname === "localhost") setIsDev(true);

    if (mode === "adsense" && adRef.current && (window as any).adsbygoogle) {
      try {
        if (adRef.current.innerHTML === "") {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (e) { console.error("AdSense error", e); }
    }
  }, [mode]);

  // --- OPTION A: AFFILIATE MODE (Show this while waiting for Google) ---
  if (mode === "affiliate" && affiliateLink && affiliateImage) {
    return (
      <div className="w-full my-8 flex flex-col items-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">{label}</span>
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block hover:opacity-90 transition-opacity w-full max-w-[728px]"
        >
          {/* We use a standard <img> tag here for external banner flexibility */}
          <img 
            src={affiliateImage} 
            alt={affiliateAlt} 
            className="w-full h-auto rounded-lg shadow-sm border border-slate-100"
          />
        </a>
      </div>
    );
  }

  // --- OPTION B: ADSENSE MODE (Use this once approved) ---
  if (isDev) {
    return (
      <div className="w-full my-8 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center py-8 text-slate-400">
        <span className="font-bold text-[10px] uppercase tracking-widest mb-2">AdSense Placeholder</span>
        <div className="bg-slate-200 px-4 py-2 rounded text-xs font-mono">Slot: {slot}</div>
      </div>
    );
  }

  return (
    <div className="w-full my-8 flex flex-col items-center overflow-hidden min-h-[100px]">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">{label}</span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE" // <--- REPLACE LATER
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
    </div>
  );
}
