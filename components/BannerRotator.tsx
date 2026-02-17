"use client";

import { useEffect, useState } from "react";

type BannerProps = {
  mode: "affiliate" | "adsense";
  affiliateLink?: string;
  affiliateImage?: string;
  slot?: string;
};

export function BannerRotator({ mode, affiliateLink, affiliateImage, slot }: BannerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (mode === "adsense" && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [mode]);

  if (!isMounted) return <div className="h-24" />;

  // 1. AFFILIATE MODE (Clean image, no text label)
  if (mode === "affiliate" && affiliateLink && affiliateImage) {
    return (
      <div className="w-full my-8 flex flex-col items-center">
        <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
          <img 
            src={affiliateImage} 
            alt="Recommended Tool" 
            className="rounded-xl shadow-md border border-slate-200 max-w-full h-auto" 
          />
        </a>
      </div>
    );
  }

  // 2. ADSENSE MODE (Auto-ads)
  if (mode === "adsense") {
    return (
      <div className="w-full my-8 text-center min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return null;
}
