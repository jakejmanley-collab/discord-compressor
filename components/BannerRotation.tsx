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

  if (mode === "affiliate" && affiliateLink && affiliateImage) {
    return (
      <div className="w-full my-8 flex flex-col items-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest mb-2 font-bold">Sponsored Offer</span>
        <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity">
          <img 
            src={affiliateImage} 
            alt="Sponsored Deal" 
            className="rounded-xl shadow-md border border-slate-200 max-w-full h-auto" 
          />
        </a>
      </div>
    );
  }

  if (mode === "adsense") {
    return (
      <div className="w-full my-8 text-center">
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
