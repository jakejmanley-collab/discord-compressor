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
    // We use a specific version to ensure all 3 files (js, wasm, worker) match
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
        // ADDED: Explicitly load the worker to fix ERR_FILE_NOT_FOUND
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

    // Target slightly less than 8MB for a safety buffer
    const targetSizeKb = 7.5 * 1024 * 8; 
    const calcBitrate = Math.floor(targetSizeKb / duration);
    const bitrateStr = `${calcBitrate}k`;

    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    // SINGLE PASS with strict buffer to prevent memory bounds error
    setStatus(`Optimizing at ${bitrateStr}...`);
    
    await ffmpeg.exec([
      "-i", "input.mp4",
      "-b:v", bitrateStr,
      "-maxrate", bitrateStr,
      "-bufsize", "1500k", // Controls memory spikes
      "-c:v", "libx264",
      "-preset", "veryfast", // Faster is more stable for browser memory
      "-c:a", "aac",
      "-b:a", "128k",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
    
    setOutputUrl(url);
    setIsLoading(false);
    setStatus("Done! High-quality file ready.");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Discord Video Compressor
        </h1>
        <p className="text-slate-500 text-lg">
          Maximum quality <span className="text-indigo-600 font-bold">8MB targeting</span> for Discord.
        </p>
      </div>

      <Card className="w-full max-w-xl shadow-xl bg-white border-slate-200">
        <CardContent className="p-8 flex flex-col items-center space-y-6">
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
            </div>
          )}

          {videoFile && !isLoading && !outputUrl && (
            <div className="text-center w-full">
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm mb-4 inline-block font-medium">
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)
              </div>
              <Button onClick={compress} disabled={!loaded} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">
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
              <h3 className="text-xl font-bold text-slate-800">Optimization Complete!</h3>
              <a href={outputUrl} download={`discord_ready_${videoFile?.name}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12">Download File</Button>
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
