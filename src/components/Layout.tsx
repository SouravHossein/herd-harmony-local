import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Weight, 
  Heart, 
  GitBranch, 
  Download, 
  Upload, 
  Settings,
  Activity,
  Bot,
  DollarSign,
  TrendingUp,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', page: 'dashboard', icon: Home },
    { name: 'Goats', page: 'goats', icon: Heart },
    { name: 'Weight Tracking', page: 'weight', icon: TrendingUp },
    { name: 'Health AI', page: 'health-ai', icon: Activity },
    { name: 'Pedigree', page: 'pedigree', icon: GitBranch },
    { name: 'Finance', page: 'finance', icon: DollarSign },
    { name: 'Backup', page: 'backup', icon: Shield },
    { name: 'Settings', page: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GoatTracker
              </h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.page}
                    variant={currentPage === item.page ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(item.page)}
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-200',
                      currentPage === item.page 
                        ? 'bg-gradient-primary text-white shadow-glow' 
                        : 'hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-border/40 p-2">
        <div className="flex justify-around">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.page}
                variant={currentPage === item.page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(item.page)}
                className={cn(
                  'flex flex-col items-center space-y-1 h-auto py-2',
                  currentPage === item.page 
                    ? 'bg-gradient-primary text-white' 
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
