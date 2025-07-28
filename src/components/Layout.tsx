
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Plus, 
  Weight, 
  Heart, 
  Baby, 
  FileText, 
  Settings, 
  Download,
  Upload,
  Menu,
  X,
  GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'goats', label: 'Goats', icon: Plus },
  { id: 'weight', label: 'Weight Tracking', icon: Weight },
  { id: 'health', label: 'Health Records', icon: Heart },
  { id: 'breeding', label: 'Breeding', icon: Baby },
  { id: 'pedigree', label: 'Pedigree', icon: GitBranch },
  { id: 'reports', label: 'Reports', icon: FileText },
];

const dataItems = [
  { id: 'export', label: 'Export Data', icon: Download },
  { id: 'import', label: 'Import Data', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-card shadow-card"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-soft transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🐐</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">GoatTracker</h1>
              <p className="text-sm text-muted-foreground">Farm Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Management
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  currentPage === item.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 mt-6">
            Data Management
          </div>
          {dataItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  currentPage === item.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden" /> {/* Spacer for mobile menu button */}
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {navigationItems.find(item => item.id === currentPage)?.label || 
                 dataItems.find(item => item.id === currentPage)?.label || 
                 'Dashboard'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
