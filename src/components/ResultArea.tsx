import VideoPlayer from "./VideoPlayer";
import DownloadCard from "./DownloadCard";

interface MediaResult {
  platform: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  videos?: { url: string; quality?: string }[];
  audio?: string;
  images?: string[];
}

interface ResultAreaProps {
  result: MediaResult | null;
}

const ResultArea = ({ result }: ResultAreaProps) => {
  if (!result) return null;

  return (
    <div className="glass rounded-3xl p-8 animate-fade-in-up">
      {result.title && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground">{result.title}</h3>
          {result.author && (
            <p className="text-sm text-muted-foreground mt-1">By {result.author}</p>
          )}
        </div>
      )}

      {result.thumbnail && (
        <img 
          src={result.thumbnail} 
          alt={result.title || "Thumbnail"} 
          className="w-full max-h-52 object-cover rounded-xl mb-6 border border-border"
        />
      )}

      <div className="space-y-6">
        {result.videos?.map((video, index) => (
          <VideoPlayer 
            key={index} 
            url={video.url} 
            label={video.quality || `Video ${index + 1}`} 
          />
        ))}

        {result.audio && (
          <DownloadCard label="Download Audio (MP3)" url={result.audio} type="music" />
        )}

        {result.images?.map((imageUrl, index) => (
          <DownloadCard 
            key={index} 
            label={`Download Image ${index + 1}`} 
            url={imageUrl} 
            type="image" 
          />
        ))}
      </div>
    </div>
  );
};

export default ResultArea;
