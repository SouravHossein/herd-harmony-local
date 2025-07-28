import React, { useState } from 'react';
import {
  Home,
  Users,
  Scale,
  TrendingUp,
  Heart,
  GitBranch,
  Wheat,
  DollarSign,
  Database,
  HardDrive,
} from 'lucide-react';
import { Sidebar } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ModeToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/goats', label: 'Goat Management', icon: Users },
  { href: '/weight', label: 'Weight Tracking', icon: Scale },
  { href: '/growth', label: 'Growth Optimizer', icon: TrendingUp },
  { href: '/health', label: 'Health AI', icon: Heart },
  { href: '/pedigree', label: 'Pedigree Tree', icon: GitBranch },
  { href: '/feed', label: 'Feed Management', icon: Wheat },
  { href: '/finance', label: 'Finance', icon: DollarSign },
  { href: '/data', label: 'Data Management', icon: Database },
  { href: '/backup', label: 'Backup', icon: HardDrive },
];

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="w-64 border-r flex-none">
        <div className="p-4">
          <h1 className="font-bold text-2xl">Goat Tracker</h1>
        </div>
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-secondary ${
                currentView === item.href.slice(1) ? 'bg-secondary font-medium' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                onViewChange(item.href.slice(1));
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        <div className="mt-auto p-4">
          <ModeToggle />
        </div>
      </Sidebar>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
