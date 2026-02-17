"use client";

import { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Card, CardContent, Button } from "@/components/ui-elements";
import { Upload, Download, Loader2, CheckCircle2, Clock, Trash2 } from "lucide-react";

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
  const [currentStatus, setCurrentStatus] = useState("Loading engines...");
  
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
      setCurrentStatus("Ready");
    } catch (error) {
      setCurrentStatus("Engine error. Refresh.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

      // Update status to processing
      setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "processing" } : j));

      const ffmpeg = ffmpegRef.current;
      const job = jobs[i];
      const duration = await getVideoDuration(job.file);
      
      const targetSizeKb = 7.6 * 1024 * 8; 
      const calcBitrate = Math.floor(targetSizeKb / duration);
      const bitrateStr = `${calcBitrate}k`;

      await ffmpeg.writeFile("input", await fetchFile(job.file));
      
      await ffmpeg.exec([
        "-i", "input",
        "-b:v", bitrateStr,
        "-maxrate", bitrateStr,
        "-bufsize", "2000k",
        "-vf", calcBitrate < 1200 ? "scale=-2:480" : "scale=-2:720",
        "-c:v", "libx264",
        "-preset", "superfast",
        "-c:a", "aac",
        "-b:a", "128k",
        "output.mp4"
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));

      setJobs(prev => prev.map((j, idx) => 
        idx === i ? { ...j, status: "completed", outputUrl: url, progress: 100 } : j
      ));
    }

    setIsProcessingQueue(false);
  };

  const removeJob = (index: number) => {
    setJobs(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-white border-slate-200">
      <CardContent className="p-6">
        
        {/* UPLOAD AREA */}
        <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative mb-6">
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange} 
            accept="video/*" 
          />
          <Upload className="w-8 h-8 text-slate-400 mb-1" />
          <p className="text-sm text-slate-500 font-medium text-center px-4">
            Drag & Drop or <span className="text-indigo-600">Browse Files</span>
            <br/><span className="text-[10px] uppercase text-slate-400">Bulk Upload Supported</span>
          </p>
        </div>

        {/* QUEUE LIST */}
        <div className="space-y-3 max-h-80 overflow-y-auto mb-6 pr-2">
          {jobs.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">No files selected yet.</p>
          )}
          {jobs.map((job, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3 overflow-hidden">
                {job.status === "completed" ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : 
                 job.status === "processing" ? <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" /> : 
                 <Clock className="w-5 h-5 text-slate-300 shrink-0" />}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">{job.file.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{(job.file.size / 1024 / 1024).toFixed(1)}MB • {job.status}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {job.outputUrl ? (
                  <a href={job.outputUrl} download={`discord_${job.file.name}`}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 px-3">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                ) : (
                  <button onClick={() => removeJob(i)} className="p-2 hover:text-red-500 text-slate-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <Button 
          onClick={processQueue} 
          disabled={!loaded || isProcessingQueue || jobs.filter(j => j.status === "pending").length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg font-bold"
        >
          {isProcessingQueue ? `Processing (${jobs.filter(j => j.status === "completed").length}/${jobs.length})` : 
           !loaded ? "Initializing Engine..." : 
           `Compress All Files`}
        </Button>

      </CardContent>
    </Card>
  );
}
