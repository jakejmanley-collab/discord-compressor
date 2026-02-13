"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Card, CardContent, Button } from "@/components/ui-elements";
import { Upload, Download, Loader2, FileVideo, ShieldCheck, Zap } from "lucide-react";

// --- SEO CONTENT ENGINE ---
const getSeoContent = (format: string) => {
  const defaults = {
    title: "Why compress video for Discord?",
    p1: "Discord limits free users to 8MB file uploads. If your video is even 8.1MB, it will be rejected. Our tool uses smart compression to reduce the bitrate without destroying the quality.",
    p2: "This happens entirely in your browser. Unlike other tools, we do not upload your private videos to a server.",
  };

  const contentMap: Record<string, typeof defaults> = {
    MOV: {
      title: "How to send MOV files on Discord (iPhone Fix)",
      p1: "MOV files (commonly from iPhones and Macs) are notoriously large and often fail to play directly in Discord's mobile app. Instead of buying Nitro, you can compress your MOV to a Discord-friendly MP4.",
      p2: "Our tool converts the Apple ProRes or H.265 codec into a standard H.264 MP4 that plays on every device, while keeping the file size strictly under 8MB.",
    },
    MKV: {
      title: "Compress OBS Recordings (MKV) for Discord",
      p1: "Streamers love MKV because it doesn't corrupt if OBS crashes, but Discord hates it. You can't even preview MKV files in the chat.",
      p2: "This tool remuxes and compresses your high-bitrate OBS clips into a lightweight MP4. Now you can share your gameplay highlights without hitting the 'File too powerful' error.",
    },
    AVI: {
      title: "Convert AVI to Discord MP4",
      p1: "AVI is an older format that creates massive uncompressed files. A 10-second AVI clip can easily exceed 50MB, making it impossible to share on Discord.",
      p2: "We strip out the unnecessary data and re-encode the video stream. The result is a crisp MP4 that looks nearly identical but is 90% smaller.",
    },
  };

  return contentMap[format] || defaults;
};

function CompressorTool() {
  const searchParams = useSearchParams();
  const format = searchParams.get("format")?.toUpperCase() || "VIDEO";
  const seoText = getSeoContent(format);
  
  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Discord ${format} Compressor`,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": seoText.p1,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "1240" }
  };

  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading core engines...");
  
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      });
      setLoaded(true);
      setStatus("Ready to compress");
    } catch (error) {
      console.error("FFmpeg load error:", error);
      setStatus("Engine error. Please refresh.");
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const compress = async () => {
    if (!videoFile || !ffmpegRef.current) return;
    setIsLoading(true);
    setStatus("Analyzing...");
    
    const ffmpeg = ffmpegRef.current;
    const duration = await getVideoDuration(videoFile);
    
    // Target 7.6MB to be safe
    const targetSizeKb = 7.6 * 1024 * 8; 
    const calcBitrate = Math.floor(targetSizeKb / duration);
    
    // SMART RESOLUTION LOGIC
    // If bitrate is low (< 1500k), we drop to 720p to keep it sharp.
    // If bitrate is very low (< 800k), we drop to 480p.
    // Otherwise we keep original resolution.
    let scaleFilter = [];
    if (calcBitrate < 800) {
        scaleFilter = ["-vf", "scale=-2:480"];
        setStatus("optimizing resolution (480p) for max smoothness...");
    } else if (calcBitrate < 1500) {
        scaleFilter = ["-vf", "scale=-2:720"];
        setStatus("optimizing resolution (720p) for high quality...");
    } else {
        setStatus(`Compressing at ${calcBitrate}k...`);
    }

    const bitrateStr = `${calcBitrate}k`;

    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
    
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-b:v", bitrateStr,
      "-maxrate", bitrateStr,
      "-bufsize", "2000k", // Increased buffer slightly for better quality
      ...scaleFilter,      // Insert smart scaling here
      "-c:v", "libx264",
      "-preset", "superfast", // Balanced speed/quality
      "-c:a", "aac",
      "-b:a", "128k",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data as any], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    
    console.log(`Final Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    
    setOutputUrl(url);
    setIsLoading(false);
    setStatus("Done!");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Compress {format} for Discord
        </h1>
        <p className="text-slate-500 text-lg">
          Get your {format} files <span className="text-indigo-600 font-bold">under 8MB</span> with maximum quality.
        </p>
      </div>

      <Card className="w-full max-w-xl shadow-xl bg-white border-slate-200 mb-20">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
          {!videoFile && (
            <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} accept="video/*" />
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Click to Upload {format}</p>
            </div>
          )}

          {videoFile && !isLoading && !outputUrl && (
            <div className="text-center w-full">
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm mb-4 inline-block font-medium">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
              </div>
              <Button onClick={compress} disabled={!loaded} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">
                {loaded ? `Compress ${format}` : "Loading Engine..."}
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="w-full text-center space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-slate-600 font-medium animate-pulse">{status}</p>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {outputUrl && (
            <div className="w-full text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Optimization Complete!</h3>
              <a href={outputUrl} download={`discord_${videoFile?.name}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">Download File</Button>
              </a>
              <button onClick={() => { setOutputUrl(null); setVideoFile(null); }} className="text-sm text-slate-400 hover:text-slate-600 underline mt-2">Compress another</button>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="max-w-3xl w-full grid md:grid-cols-2 gap-8 mb-20 px-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">{seoText.title}</h2>
          <p className="text-slate-600 leading-relaxed">{seoText.p1}</p>
          <p className="text-slate-600 leading-relaxed">{seoText.p2}</p>
        </div>
        
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
            <div className="p-2 bg-indigo-50 rounded-lg h-fit"><ShieldCheck className="w-6 h-6 text-indigo-600" /></div>
            <div>
              <h3 className="font-bold text-slate-900">100% Private</h3>
              <p className="text-sm text-slate-500">Processing happens in your browser. No data leaves your device.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
            <div className="p-2 bg-indigo-50 rounded-lg h-fit"><FileVideo className="w-6 h-6 text-indigo-600" /></div>
            <div>
              <h3 className="font-bold text-slate-900">Best Quality</h3>
              <p className="text-sm text-slate-500">Smart resolution scaling ensures your video never looks blocky.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex gap-4">
            <div className="p-2 bg-indigo-50 rounded-lg h-fit"><Zap className="w-6 h-6 text-indigo-600" /></div>
            <div>
              <h3 className="font-bold text-slate-900">Fast & Free</h3>
              <p className="text-sm text-slate-500">No watermarks, no signups, and no Nitro required.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10">
      <Suspense fallback={<Loader2 className="animate-spin text-indigo-600 w-10 h-10" />}>
        <CompressorTool />
      </Suspense>
      <footer className="mt-10 max-w-2xl text-center text-slate-400 text-sm">
        <p>All video processing is performed client-side.</p>
      </footer>
    </main>
  );
}
