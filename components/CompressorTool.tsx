"use client";

import { useState, useEffect, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Card, CardContent, Button } from "@/components/ui-elements";
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
        setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: "error" } : j));
      }
    }
    setIsProcessingQueue(false);
  };

  const downloadAll = () => {
    const completedJobs = jobs.filter(j => j.status === "completed" && j.outputUrl);
    completedJobs.forEach((job, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = job.outputUrl!;
        link.download = `discord_${job.file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 400); 
    });
  };

  const removeJob = (index: number) => {
    setJobs(prev => prev.filter((_, i) => i !== index));
  };

  const completedCount = jobs.filter(j => j.status === "completed").length;
  const pendingCount = jobs.filter(j => j.status === "pending").length;

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-white border-slate-200 overflow-hidden">
      <CardContent className="p-6">
        
        {/* UPLOAD AREA */}
        <div className="w-full h-40 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center bg-indigo-50/30 hover:bg-indigo-50 transition-all cursor-pointer relative mb-6 group">
          <input 
            type="file" 
            multiple // IMPORTANT: Allows multiple selection
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileChange} 
            accept="video/*" 
          />
          <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-sm text-slate-600 font-semibold text-center px-4">
            Select or Drag <span className="text-indigo-600 font-bold">Multiple Videos</span>
            <br/><span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1 inline-block">Bulk Mode Enabled</span>
          </p>
        </div>

        {/* QUEUE LIST */}
        <div className="space-y-3 max-h-72 overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
          {jobs.length === 0 && <div className="text-center py-10 text-slate-400 text-sm italic">Queue is empty. Select files to begin.</div>}
          {jobs.map((job, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`p-2 rounded-lg ${job.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                  {job.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : job.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">{job.file.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium lowercase">
                    {(job.file.size / 1024 / 1024).toFixed(1)}mb • {job.status === 'processing' ? `compressing ${job.progress}%` : job.status}
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
                  <button onClick={() => removeJob(i)} disabled={job.status === "processing"} className="p-2 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-lg transition-colors disabled:opacity-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">
          {pendingCount > 0 && (
            <Button 
              onClick={processQueue} 
              disabled={!loaded || isProcessingQueue} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              {isProcessingQueue ? `Processing Queue...` : `Compress ${pendingCount} Files`}
            </Button>
          )}

          {completedCount > 1 && !isProcessingQueue && (
            <Button 
              onClick={downloadAll} 
              className="w-full bg-slate-900 hover:bg-black text-white h-14 text-lg font-bold rounded-xl shadow-lg flex gap-2 items-center justify-center transition-all"
            >
              <DownloadCloud className="w-6 h-6" /> Download All Files
            </Button>
          )}

          {jobs.length > 0 && !isProcessingQueue && (
            <button 
              onClick={() => setJobs([])} 
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium mt-2"
            >
              Clear all files and start over
            </button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
