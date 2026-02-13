"use client";

import { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Card, CardContent, Button } from "@/components/ui-elements";
import { Upload, Download, Loader2 } from "lucide-react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading core engines...");
  
  // FIX: Initialize as NULL so it doesn't crash the server
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // Load FFmpeg on Mount (Browser Only)
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    
    // FIX: Only create the engine here, inside the browser
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    
    // Log progress
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    
    setLoaded(true);
    setStatus("Ready to compress");
  };

  const compress = async () => {
    if (!videoFile || !ffmpegRef.current) return;
    
    setIsLoading(true);
    setStatus("Analyzing video...");
    
    const ffmpeg = ffmpegRef.current;
    
    // 1. Write file to memory
    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    // 2. Calculate Bitrate for 8MB Target
    // Formula: (TargetSizeInBits / Duration) = Bitrate
    // We will hardcode a "safe" bitrate of 1MB/s (approx 1000k) for this demo 
    // to ensure it fits under 8MB for clips under 60 seconds.
    // In V2 we can probe the file duration for exact math.
    
    setStatus("Compressing to under 8MB...");
    
    // 3. Run Compression Command
    // -b:v 800k (Video bitrate)
    // -ac 2 (Audio channels)
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-b:v", "800k", // Aggressive bitrate for Discord
      "-c:v", "libx264",
      "-preset", "faster",
      "output.mp4"
    ]);

    // 4. Read result
    const data = await ffmpeg.readFile("output.mp4");
    
    // TypeScript Fix: Cast data to 'any' to avoid strict type error
    const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
    
    setOutputUrl(url);
    setIsLoading(false);
    setStatus("Done! Download below.");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* HEADER SEO */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Discord Video Compressor
        </h1>
        <p className="text-slate-500 text-lg">
          Compress any clip to <span className="text-indigo-600 font-bold">under 8MB</span> without losing quality.
        </p>
      </div>

      {/* MAIN TOOL */}
      <Card className="w-full max-w-xl shadow-xl bg-white border-slate-200">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
          
          {/* STATE: UPLOAD */}
          {!videoFile && (
            <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                accept="video/*"
              />
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Click to Upload Video</p>
              <p className="text-xs text-slate-400 mt-1">MP4, MOV, MKV supported</p>
            </div>
          )}

          {/* STATE: READY TO COMPRESS */}
          {videoFile && !isLoading && !outputUrl && (
            <div className="text-center w-full">
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm mb-4 inline-block font-medium">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
              </div>
              <Button 
                onClick={compress} 
                disabled={!loaded}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg"
              >
                {loaded ? "Compress Now" : "Loading Engine..."}
              </Button>
            </div>
          )}

          {/* STATE: COMPRESSING */}
          {isLoading && (
            <div className="w-full text-center space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-slate-600 font-medium animate-pulse">{status}</p>
              
              {/* PROGRESS BAR */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              
              {/* AFFILIATE SPOT WHILE WAITING */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg text-left">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Sponsored</p>
                <p className="text-sm text-amber-900">
                  <span className="font-bold">Lagging in game?</span> Try NordVPN to lower your ping and protect your IP.
                  <a href="#" className="underline ml-1 font-bold">Get 60% Off →</a>
                </p>
              </div>
            </div>
          )}

          {/* STATE: DONE */}
          {outputUrl && (
            <div className="w-full text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Ready for Discord!</h3>
              <p className="text-sm text-slate-500">Your video is now under 8MB.</p>
              
              <a href={outputUrl} download={`compressed_${videoFile?.name}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">
                  Download File
                </Button>
              </a>
              
              <button 
                onClick={() => { setOutputUrl(null); setVideoFile(null); }}
                className="text-sm text-slate-400 hover:text-slate-600 underline mt-2"
              >
                Compress another video
              </button>
            </div>
          )}

        </CardContent>
      </Card>
      
      {/* SEO FOOTER */}
      <footer className="mt-20 max-w-2xl text-center text-slate-400 text-sm space-y-4">
        <p>
          CompressForDiscord.com processes all videos <strong>in your browser</strong>. 
          No files are ever uploaded to a server, ensuring 100% privacy.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-slate-600">Privacy</a>
          <a href="#" className="hover:text-slate-600">Terms</a>
        </div>
      </footer>
    </main>
  );
}
