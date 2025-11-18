import {
  MessageSquare,
  Mail,
  Bot,
  Brain,
  Wand2,
  Sparkles,
  Heart,
  FileText,
  Volume2,
  ImageIcon,
  Zap,
  Search,
  Star,
  Server,
  Mic,
  AudioLines,
  Flame,
  Network,
  Palette,
  Globe,
  CreditCard,
  UserPlus,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';

// Map of icon names to Lucide icon components
export const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Mail,
  Bot,
  Brain,
  Wand2,
  Sparkles,
  Heart,
  FileText,
  Volume2,
  ImageIcon,
  Zap,
  Search,
  Star,
  Server,
  Mic,
  AudioLines,
  Flame,
  Network,
  Palette,
  Globe,
  CreditCard,
  UserPlus,
  DollarSign,
};

// Helper component to render an icon by name
export function Icon({
  name,
  className,
  size = 24,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Fallback to the string (for any legacy emojis)
    return <span className={className}>{name}</span>;
  }

  return <IconComponent className={className} size={size} />;
}
