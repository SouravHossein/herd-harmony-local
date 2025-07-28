
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Scale, 
  Heart, 
  GitBranch, 
  DollarSign, 
  Settings, 
  Download, 
  Upload, 
  Shield,
  Wheat
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'goats', label: 'Goat Management', icon: Users },
    { id: 'weight', label: 'Weight Tracking', icon: Scale },
    { id: 'health-ai', label: 'Health AI', icon: Heart },
    { id: 'feed', label: 'Feed & Nutrition', icon: Wheat },
    { id: 'pedigree', label: 'Pedigree', icon: GitBranch },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'backup', label: 'Backup', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'import', label: 'Import', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold text-foreground">Goat Tracker</h1>
            <p className="text-sm text-muted-foreground">Farm Management System</p>
          </div>
          
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onPageChange(item.id)}
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
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
