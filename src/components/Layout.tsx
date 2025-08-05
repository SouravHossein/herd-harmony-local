
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Scale,
  Heart,
  GitBranch,
  DollarSign,
  Wheat,
  Activity,
  TrendingUp,
  Baby,
  Database,
  Shield,
  CloudSun,
  Settings,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'weight', label: 'Weight', icon: Scale },
  { id: 'goats', label: 'Goats', icon: Users },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'breeding', label: 'Breeding', icon: Baby },
  { id: 'pedigree', label: 'Pedigree', icon: GitBranch },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'feed', label: 'Feed', icon: Wheat },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'health-ai', label: 'Health AI', icon: Activity },
  { id: 'growth-optimizer', label: 'Growth', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Layout({ children, activeSection, onSectionChange }: LayoutProps) {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Monitor;
    }
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Goat Tracker</h1>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={cycleTheme}
                title={`Current theme: ${theme}`}
              >
                <ThemeIcon className="h-4 w-4" />
                {/* <span className="hidden sm:inline-block">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span> */}
              </Button>
            </div>
          </div>
          {/* </div> */}
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeSection === item.id && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>


        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
