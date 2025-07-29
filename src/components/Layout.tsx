
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
  CloudSun
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'goats', label: 'Goats', icon: Users },
  { id: 'weight', label: 'Weight', icon: Scale },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'breeding', label: 'Breeding', icon: Baby },
  { id: 'pedigree', label: 'Pedigree', icon: GitBranch },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'feed', label: 'Feed', icon: Wheat },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'health-ai', label: 'Health AI', icon: Activity },
  { id: 'growth-optimizer', label: 'Growth', icon: TrendingUp },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'backup', label: 'Backup', icon: Shield },
];

export function Layout({ children, activeSection, onSectionChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-6">
            <h1 className="text-xl font-bold text-foreground">Goat Tracker</h1>
          </div>
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
