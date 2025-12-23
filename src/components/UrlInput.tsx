import { Link, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: () => void;
}

const UrlInput = ({ value, onChange, onPaste }: UrlInputProps) => {
  return (
    <div className="relative flex items-center glass rounded-2xl p-1 transition-all duration-300 focus-within:border-primary focus-within:glow-primary focus-within:scale-[1.02]">
      <Link className="ml-5 text-primary w-5 h-5 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your link here..."
        className="w-full px-4 py-5 bg-transparent border-none text-foreground text-lg outline-none placeholder:text-muted-foreground"
        autoComplete="off"
      />
      <Button
        type="button"
        variant="ghost"
        onClick={onPaste}
        className="mr-1 px-4 py-2 rounded-xl border border-border hover:bg-muted hover:text-primary transition-all"
      >
        <Clipboard className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline font-semibold">Paste</span>
      </Button>
    </div>
  );
};

export default UrlInput;
