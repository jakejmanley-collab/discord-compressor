"use client";

import { useEffect, useRef, useState } from "react";

type AdProps = {
  slot: string; // The ID from Google AdSense
  format?: "auto" | "rectangle" | "horizontal";
  label?: string; // e.g. "Advertisement"
};

export function AdUnit({ slot, format = "auto", label = "Advertisement" }: AdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check if we are in development mode (localhost)
    if (window.location.hostname === "localhost") {
      setIsDev(true);
      return;
    }

    try {
      if (adRef.current && (window as any).adsbygoogle) {
        // Only load if empty to prevent duplicate ads
        if (adRef.current.innerHTML === "") {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  // 1. DEVELOPMENT MODE PLACEHOLDER (Shows gray box on localhost)
  if (isDev) {
    return (
      <div className="w-full my-8 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center py-10 text-slate-400">
        <span className="font-bold text-xs uppercase tracking-widest mb-2">{label}</span>
        <div className="w-[300px] h-[250px] bg-slate-200 rounded flex items-center justify-center">
          Ad Slot: {slot}
        </div>
      </div>
    );
  }

  // 2. REAL ADS (Shows on live site)
  return (
    <div className="w-full my-8 flex flex-col items-center overflow-hidden min-h-[250px]">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">{label}</span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", minWidth: "300px", textAlign: "center" }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID_HERE" // <--- REPLACE THIS LATER
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
    </div>
  );
}
