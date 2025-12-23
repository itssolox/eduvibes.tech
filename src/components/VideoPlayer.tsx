import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  url: string;
  label?: string;
}

const VideoPlayer = ({ url, label }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-[350px] mx-auto rounded-2xl overflow-hidden bg-background border border-border shadow-2xl group">
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 glass rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:scale-110 hover:bg-muted/50"
          >
            <Play className="w-7 h-7 text-foreground ml-1" />
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full max-h-[500px] object-contain bg-background"
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={togglePlay} className="text-foreground">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-foreground">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center justify-center gap-3 w-full max-w-[350px] mx-auto px-6 py-3 rounded-full border border-primary bg-primary/10 text-primary font-bold uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground hover:glow-primary"
      >
        <Download className="w-5 h-5" />
        Download {label}
      </a>
    </div>
  );
};

export default VideoPlayer;
