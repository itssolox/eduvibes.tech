import { useState, useCallback, useEffect } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import UrlInput from "@/components/UrlInput";
import ProgressBar from "@/components/ProgressBar";
import ResultArea from "@/components/ResultArea";
import PlatformIcons from "@/components/PlatformIcons";

const API_BASE = "https://socialdown.itz-ashlynn.workers.dev";

interface MediaResult {
  platform: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  videos?: { url: string; quality?: string }[];
  audio?: string;
  images?: string[];
}

const detectPlatform = (url: string): string | null => {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("pinterest.com") || url.includes("pin.it")) return "pinterest";
  if (url.includes("mediafire.com")) return "mediafire";
  if (url.includes("capcut.com")) return "capcut";
  return null;
};

const Index = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && progress < 85) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 5, 85));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoading, progress]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      toast({
        title: "Paste failed",
        description: "Please paste the URL manually",
        variant: "destructive",
      });
    }
  };

  const processUrl = useCallback(async () => {
    if (!url.trim()) {
      toast({
        title: "No URL provided",
        description: "Please paste a valid URL first",
        variant: "destructive",
      });
      return;
    }

    const platform = detectPlatform(url);
    if (!platform) {
      toast({
        title: "Unsupported platform",
        description: "Please try Instagram, TikTok, YouTube, Facebook, or other supported platforms",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      let endpoint = "";
      const params = `?url=${encodeURIComponent(url)}`;

      if (platform === "youtube" || platform === "instagram") {
        endpoint = platform === "youtube" ? "/yt" : "/insta";
        
        const [mp4Res, mp3Res] = await Promise.all([
          fetch(`${API_BASE}${endpoint}${params}&format=mp4`),
          fetch(`${API_BASE}${endpoint}${params}&format=mp3`).catch(() => null),
        ]);

        const mp4Data = await mp4Res.json();
        let mp3Data = null;
        try {
          if (mp3Res) {
            const mp3Json = await mp3Res.json();
            if (mp3Json.success !== false) {
              mp3Data = mp3Json;
            }
          }
        } catch {
          console.warn("MP3 fetch failed");
        }

        setProgress(100);

        if (!mp4Data.success && (!mp3Data || !mp3Data.success)) {
          throw new Error(mp4Data.error || "Failed to fetch content");
        }

        const videos = mp4Data.urls?.map((u: string) => ({ url: u })) || 
                      (mp4Data.data?.[0]?.downloadUrl ? [{ url: mp4Data.data[0].downloadUrl }] : []);
        
        // Get audio URL from multiple possible sources
        let audioUrl = null;
        if (mp3Data?.audio) {
          audioUrl = mp3Data.audio;
        } else if (mp3Data?.urls && mp3Data.urls.length > 0) {
          audioUrl = mp3Data.urls[0];
        } else if (mp3Data?.data?.[0]?.downloadUrl) {
          audioUrl = mp3Data.data[0].downloadUrl;
        } else if (mp4Data.audio) {
          audioUrl = mp4Data.audio;
        }
        
        setResult({
          platform,
          title: mp4Data.data?.[0]?.title || `${platform.charAt(0).toUpperCase() + platform.slice(1)} Content`,
          videos,
          audio: audioUrl,
        });
        
        setUrl("");
        return;
      }

      switch (platform) {
        case "facebook": endpoint = "/fb"; break;
        case "tiktok": endpoint = "/tiktok"; break;
        case "twitter": endpoint = "/x"; break;
        case "spotify": endpoint = "/spotify"; break;
        case "pinterest": endpoint = "/pinterest"; break;
        case "mediafire": endpoint = "/mediafire"; break;
        case "capcut": endpoint = "/capcut"; break;
      }

      const response = await fetch(`${API_BASE}${endpoint}${params}`);
      const data = await response.json();

      setProgress(100);

      if (data.success === false || data.error) {
        throw new Error(data.error || "Failed to fetch content");
      }

      let processedResult: MediaResult = { platform };

      switch (platform) {
        case "facebook":
          processedResult.videos = data.hd ? [{ url: data.hd, quality: "HD" }] : 
                                  data.sd ? [{ url: data.sd, quality: "SD" }] : [];
          processedResult.audio = data.audio;
          break;
        case "tiktok":
          const tikVid = data.data?.[0];
          if (tikVid) {
            processedResult.title = tikVid.title;
            processedResult.videos = tikVid.downloadLinks?.map((l: any) => ({ url: l.link })) || [];
          }
          break;
        case "twitter":
          if (data.found && data.media) {
            processedResult.author = data.authorUsername;
            processedResult.videos = data.media.filter((m: any) => m.type === "video").map((m: any) => ({ url: m.url }));
            processedResult.images = data.media.filter((m: any) => m.type !== "video").map((m: any) => m.url);
          }
          break;
        case "spotify":
          processedResult.title = data.name;
          processedResult.author = data.artists?.join(", ");
          processedResult.thumbnail = data.image;
          processedResult.audio = data.download_url;
          break;
        case "pinterest":
          if (data.medias) {
            processedResult.title = data.title;
            processedResult.videos = data.medias.filter((m: any) => m.extension === "mp4").map((m: any) => ({ url: m.url, quality: m.quality }));
            processedResult.images = data.medias.filter((m: any) => m.extension !== "mp4").map((m: any) => m.url);
          }
          break;
        case "mediafire":
          processedResult.title = data.name;
          processedResult.audio = data.download;
          break;
        case "capcut":
          processedResult.title = data.title;
          processedResult.author = data.author;
          processedResult.thumbnail = data.coverUrl;
          break;
      }

      setResult(processedResult);
      setUrl("");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed. Please try again.";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [url, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-hidden relative px-4 py-8">
      <BackgroundOrbs />

      {/* Header */}
      <header className="text-center pt-8 pb-6 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-widest text-gradient flex items-center justify-center gap-3 drop-shadow-lg">
          <Zap className="w-10 h-10 text-primary" />
          Solox
        </h1>
        <p className="text-muted-foreground mt-2 tracking-wider">
          Universal Social Media Downloader
        </p>
      </header>

      {/* Main Card */}
      <main 
        className="w-full max-w-[650px] glass rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-400 hover:shadow-primary/10 hover:border-primary/30 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <UrlInput value={url} onChange={setUrl} onPaste={handlePaste} />

        <Button
          onClick={processUrl}
          disabled={isLoading}
          className="w-full mt-6 py-6 text-lg font-extrabold uppercase tracking-widest gradient-bg animate-gradient border-0 text-foreground hover:scale-[1.02] hover:glow-primary transition-all disabled:opacity-70"
        >
          {isLoading ? "Processing..." : "Get Content"}
        </Button>

        <ProgressBar 
          progress={progress} 
          isVisible={isLoading} 
          status="Fetching data..." 
        />

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-center backdrop-blur-sm">
            {error}
          </div>
        )}
      </main>

      {/* Results */}
      {result && (
        <div className="w-full max-w-[650px] mt-6 animate-fade-in-up">
          <ResultArea result={result} />
        </div>
      )}

      {/* Footer */}
      <footer 
        className="mt-auto pt-12 pb-6 text-center animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        <PlatformIcons />
        <p className="text-muted-foreground/50 text-sm mt-6">
          © 2024 Solox Web
        </p>
      </footer>
    </div>
  );
};

export default Index;
