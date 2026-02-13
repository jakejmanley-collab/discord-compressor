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
  
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
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
      setStatus("Error loading engine. Try refreshing.");
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
    setStatus("Analyzing video...");
    
    const ffmpeg = ffmpegRef.current;
    const duration = await getVideoDuration(videoFile);

    // Target 7.5MB to ensure we stay under the 8MB limit
    const targetSizeKb = 7.5 * 1024 * 8; 
    const calcBitrate = Math.floor(targetSizeKb / duration);
    const bitrateStr = `${calcBitrate}k`;

    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    setStatus(`Compressing at ${bitrateStr}...`);
    
    // STABILITY FIX: Added -maxrate and -bufsize to prevent memory crashes
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-b:v", bitrateStr,
      "-maxrate", bitrateStr,
      "-bufsize", "2000k", 
      "-c:v", "libx264",
      "-preset", "superfast", 
      "-c:a", "aac",
      "-b:a", "128k",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
    
    setOutputUrl(url);
    setIsLoading(false);
    setStatus("Done! File ready.");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Discord Video Compressor
        </h1>
        <p className="text-slate-500 text-lg">
          Optimized <span className="text-indigo-600 font-bold">8MB targeting</span>
        </p>
      </div>

      <Card className="w-full max-w-xl shadow-xl bg-white">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
          {!videoFile && (
            <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                accept="video/*"
              />
              <Upload className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Click to Upload Video</p>
            </div>
          )}

          {videoFile && !isLoading && !outputUrl && (
            <div className="text-center w-full">
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm mb-4 inline-block">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
              </div>
              <Button onClick={compress} disabled={!loaded} className="w-full bg-indigo-600 text-white h-12">
                {loaded ? "Compress to 8MB" : "Loading Engine..."}
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
              <h3 className="text-xl font-bold text-slate-800">Ready for Discord!</h3>
              <a href={outputUrl} download={`discord_${videoFile?.name}`}>
                <Button className="w-full bg-green-600 text-white h-12">Download File</Button>
              </a>
              <button onClick={() => { setOutputUrl(null); setVideoFile(null); }} className="text-sm text-slate-400 hover:text-slate-600 underline mt-2">
                Compress another video
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
