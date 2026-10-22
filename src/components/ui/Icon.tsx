import {
  Anchor, ArrowLeftRight, Award, BatteryCharging, BellRing, Bird, BookOpenText, Briefcase, Building2,
  Calculator, CloudSunRain, Compass, Cpu, Droplets, Earth, Eye, Factory, FileText, Gavel, Gem, Globe2,
  GraduationCap, Handshake, HardHat, HeartHandshake, Landmark, Leaf, Lightbulb, MapPinned, Megaphone,
  MessagesSquare, MonitorPlay, Mountain, Network, Plane, Radar, Recycle, Rocket, Route, Scale, ScanSearch,
  ScrollText, Search, Shirt, ShieldCheck, Ship, SlidersHorizontal, Sprout, Stethoscope, Target, Trash2,
  TrendingUp, Trophy, Users, Waves, Wheat, Workflow, Zap, type LucideIcon, type LucideProps,
} from 'lucide-react';

/** Icons referenced by name from content files. Add new ones here. */
const registry: Record<string, LucideIcon> = {
  Anchor, ArrowLeftRight, Award, BatteryCharging, BellRing, Bird, BookOpenText, Briefcase, Building2,
  Calculator, CloudSunRain, Compass, Cpu, Droplets, Earth, Eye, Factory, FileText, Gavel, Gem, Globe2,
  GraduationCap, Handshake, HardHat, HeartHandshake, Landmark, Leaf, Lightbulb, MapPinned, Megaphone,
  MessagesSquare, MonitorPlay, Mountain, Network, Plane, Radar, Recycle, Rocket, Route, Scale, ScanSearch,
  ScrollText, Search, Shirt, ShieldCheck, Ship, SlidersHorizontal, Sprout, Stethoscope, Target, Trash2,
  TrendingUp, Trophy, Users, Waves, Wheat, Workflow, Zap,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = registry[name] ?? Leaf;
  return <Cmp aria-hidden="true" {...props} />;
}
