interface ProgressBarProps {
  progress: number;
  isVisible: boolean;
  status: string;
}

const ProgressBar = ({ progress, isVisible, status }: ProgressBarProps) => {
  if (!isVisible) return null;

  return (
    <div className="mt-6 space-y-3">
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full gradient-bg rounded-full relative glow-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/80 to-transparent animate-shimmer" />
        </div>
      </div>
      <p className="text-center text-sm text-primary font-medium tracking-wide animate-pulse-glow">
        {status}
      </p>
    </div>
  );
};

export default ProgressBar;
