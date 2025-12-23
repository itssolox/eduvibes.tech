import { Download, Music, Image, Video, File } from "lucide-react";

interface DownloadCardProps {
  label: string;
  url: string;
  type?: "video" | "image" | "music" | "file";
}

const DownloadCard = ({ label, url, type = "file" }: DownloadCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "video": return <Video className="w-5 h-5" />;
      case "image": return <Image className="w-5 h-5" />;
      case "music": return <Music className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-muted/10">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-full border border-primary bg-primary/10 text-primary font-bold uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground hover:glow-primary"
      >
        {getIcon()}
        {label}
      </a>
    </div>
  );
};

export default DownloadCard;
