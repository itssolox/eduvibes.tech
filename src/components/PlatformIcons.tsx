const platforms = [
  { name: "Instagram", icon: "📸" },
  { name: "TikTok", icon: "🎵" },
  { name: "YouTube", icon: "▶️" },
  { name: "Twitter/X", icon: "🐦" },
  { name: "Facebook", icon: "📘" },
  { name: "Spotify", icon: "🎧" },
  { name: "Pinterest", icon: "📌" },
];

const PlatformIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {platforms.map((platform) => (
        <div 
          key={platform.name}
          className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-default"
        >
          <span>{platform.icon}</span>
          <span>{platform.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PlatformIcons;
