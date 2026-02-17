"use client";

import { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Card, CardContent, Button } from "@/components/ui-elements";
import { Upload, Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function CompressorTool({ format }: { format: string }) {
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
    
    // Target 7.6MB
    const targetSizeKb = 7.6 * 1024 * 8; 
    const calcBitrate = Math.floor(targetSizeKb / duration);
    
    // SMART RESOLUTION
    let scaleFilter: string[] = [];
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
      "-bufsize", "2000k", 
      ...scaleFilter,      
      "-c:v", "libx264",
      "-preset", "superfast", 
      "-c:a", "aac",
      "-b:a", "128k",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data as any], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    
    setOutputUrl(url);
    setIsLoading(false);
    setStatus("Done!");
  };

  return (
    <Card className="w-full max-w-xl shadow-xl bg-white border-slate-200">
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
  );
}
