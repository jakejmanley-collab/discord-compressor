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

    // We process sequentially to avoid crashing the browser's memory
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].status !== "pending") continue;

      setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "processing" } : j));

      const ffmpeg = ffmpegRef.current;
      const job = jobs[i];
      
      try {
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
      } catch (err) {
        console.error(err);
        setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "error" } : j));
      }
    }

    setIsProcessingQueue(false);
  };

  const removeJob = (index: number) => {
    setJobs(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-white border-slate-200 overflow-hidden">
      <CardContent className="p-6">
        
        {/* ENHANCED UPLOAD AREA */}
        <div className="w-full h-40 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center bg-indigo-50/30 hover:bg-indigo-50 transition-all cursor-pointer relative mb-6 group">
          <input 
            type="file" 
            multiple // <--- THIS ALLOWS BULK SELECT
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange} 
            accept="video/*" 
          />
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-sm text-slate-600 font-semibold text-center px-4">
            Select or Drag Multiple Videos
            <br/><span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1 inline-block">Bulk Mode Enabled</span>
          </p>
        </div>

        {/* DYNAMIC QUEUE LIST */}
        <div className="space-y-3 max-h-72 overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          {jobs.length === 0 && (
            <div className="text-center py-10">
                <p className="text-slate-400 text-sm">Waiting for files...</p>
            </div>
          )}
          {jobs.map((job, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="relative">
                    {job.status === "processing" && (
                        <div className="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <div className={`p-2 rounded-lg ${job.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                        {job.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">{job.file.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {(job.file.size / 1024 / 1024).toFixed(1)}MB • {job.status === 'processing' ? `${job.progress}%` : job.status}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pl-4">
                {job.outputUrl ? (
                  <a href={job.outputUrl} download={`discord_${job.file.name}`}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 h-9 px-4 rounded-lg flex gap-2">
                      <Download className="w-4 h-4" /> <span className="text-xs">Save</span>
                    </Button>
                  </a>
                ) : (
                  <button 
                    onClick={() => removeJob(i)} 
                    disabled={job.status === "processing"}
                    className="p-2 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-lg transition-colors disabled:opacity-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <Button 
          onClick={processQueue} 
          disabled={!loaded || isProcessingQueue || jobs.filter(j => j.status === "pending").length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
        >
          {isProcessingQueue ? `Processing Queue...` : 
           !loaded ? "Booting Engine..." : 
           `Compress ${jobs.filter(j => j.status === 'pending').length} Files Now`}
        </Button>

      </CardContent>
    </Card>
  );
}
