"use client";

import { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Upload, Download, Loader2, CheckCircle2, Clock, Trash2, DownloadCloud, Layers } from "lucide-react";

type VideoJob = {
  file: File;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  outputUrl?: string;
};

export function CompressorTool({ format }: { format: string }) {
  const [loaded, setLoaded] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [jobs, setJobs] = useState<VideoJob[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    
    ffmpeg.on("progress", ({ progress }) => {
      setJobs(prev => prev.map(job => 
        job.status === "processing" ? { ...job, progress: Math.round(progress * 100) } : job
      ));
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      });
      setLoaded(true);
    } catch (error) {
      console.error("FFmpeg load error:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // This creates a "Job" for every file selected
    const newJobs: VideoJob[] = files.map(file => ({
      file,
      status: "pending",
      progress: 0
    }));
    
    setJobs(prev => [...prev, ...newJobs]);
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

  const processQueue = async () => {
    if (isProcessingQueue || !ffmpegRef.current) return;
    setIsProcessingQueue(true);

    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].status !== "pending") continue;

      setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "processing" } : j));

      const ffmpeg = ffmpegRef.current;
      const job = jobs[i];
      
      try {
        const duration = await getVideoDuration(job.file);
        const targetSizeKb = 7.8 * 1024 * 8; 
        const calcBitrate = Math.floor(targetSizeKb / duration);
        const bitrateStr = `${calcBitrate}k`;

        await ffmpeg.writeFile("input", await fetchFile(job.file));
        
        await ffmpeg.exec([
          "-i", "input",
          "-b:v", bitrateStr,
          "-maxrate", bitrateStr,
          "-bufsize", "3000k",
          "-vf", calcBitrate < 1200 ? "scale=-2:480" : "scale=-2:720",
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-c:a", "aac",
          "-b:a", "128k",
          "output.mp4"
        ]);

        const data = await ffmpeg.readFile("output.mp4");
        const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));

        setJobs(prev => prev.map((j, idx) => 
          idx === i ? { ...j, status: "completed", outputUrl: url, progress: 100 } : j
        ));
      } catch (err) {
        setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "error" } : j));
      }
    }
    setIsProcessingQueue(false);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 flex flex-col gap-6">
        
        {/* THE UPLOAD BOX */}
        <div className="w-full h-44 border-4 border-dashed border-indigo-100 rounded-3xl flex flex-col items-center justify-center bg-indigo-50/20 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer relative group">
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            onChange={handleFileChange} 
            accept="video/*" 
          />
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center px-4">
            <p className="text-lg font-bold text-slate-700">Drop your videos here</p>
            <p className="text-sm text-slate-400">Select multiple files to bulk compress</p>
          </div>
        </div>

        {/* THE QUEUE LIST */}
        {jobs.length > 0 && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Queue: {jobs.length} files</span>
                <button onClick={() => setJobs([])} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Clear All</button>
            </div>
            {jobs.map((job, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 overflow-hidden text-left">
                  <div className={`p-2 rounded-lg ${job.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                    {job.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : job.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{job.file.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">
                        {job.status === 'processing' ? `Working... ${job.progress}%` : `Status: ${job.status}`}
                    </p>
                  </div>
                </div>
                {job.outputUrl && (
                  <a href={job.outputUrl} download={`discord_${job.file.name}`} className="bg-green-600 text-white p-2 rounded-lg shadow-sm hover:bg-green-700">
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* THE ACTION BUTTON */}
        <button 
          onClick={processQueue} 
          disabled={!loaded || isProcessingQueue || jobs.filter(j => j.status === "pending").length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white h-16 text-xl font-black rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
        >
          {isProcessingQueue ? `Processing...` : !loaded ? "Initializing..." : `Compress ${jobs.filter(j => j.status === 'pending').length} Clips`}
        </button>

        <p className="text-[10px] text-center text-slate-300 font-bold uppercase tracking-widest">
            Privacy Guaranteed: Files never leave your browser
        </p>
    </div>
  );
}
