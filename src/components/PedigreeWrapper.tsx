
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PedigreeTree from './PedigreeTree';
import { PedigreeSidebar } from './PedigreeSidebar';
import AllGoatsPedigreeView from './pedigree/AllGoatsPedigreeView';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';
import { TreePine, GitBranch, Database } from 'lucide-react';

interface PedigreeWrapperProps {
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeWrapper({ onShowHealth, onShowWeight }: PedigreeWrapperProps) {
  const { goats, updateGoat } = useGoatContext();
  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(
    goats.length > 0 ? goats[0] : null
  );
  const [generations, setGenerations] = useState(3);

  const handleGoatSelect = (goat: Goat) => {
    setSelectedGoat(goat);
  };

  const handleGoatChange = (goatId: string) => {
    const goat = goats.find(g => g.id === goatId);
    if (goat) {
      setSelectedGoat(goat);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pedigree Management</h2>
          <p className="text-muted-foreground">
            Explore family trees, analyze genetic diversity, and manage breeding decisions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Label htmlFor="goat-select" className="text-sm">Selected Goat</Label>
            <Select value={selectedGoat?.id || ''} onValueChange={handleGoatChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose a goat" />
              </SelectTrigger>
              <SelectContent>
                {goats.map(goat => (
                  <SelectItem key={goat.id} value={goat.id}>
                    {goat.name} ({goat.tagNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="generations" className="text-sm">Generations</Label>
            <Select value={generations.toString()} onValueChange={(v) => setGenerations(parseInt(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="tree" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tree" className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>Maternal Tree</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>All Goats View</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <TreePine className="h-4 w-4" />
            <span>Tree Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tree">
          <div className="flex gap-6">
            <div className="flex-1 min-h-[600px]">
              <PedigreeTree
                goats={goats}
                selectedGoatId={selectedGoat?.id || ''}
                onGoatSelect={handleGoatSelect}
                onShowHealth={onShowHealth}
                onShowWeight={onShowWeight}
                generations={generations}
              />
            </div>
            <div className="flex-shrink-0 w-80">
              <PedigreeSidebar
                goat={selectedGoat}
                onShowHealth={onShowHealth}
                onShowWeight={onShowWeight}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <AllGoatsPedigreeView />
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Breeding Insights</h3>
              <p className="text-muted-foreground">
                AI-powered breeding suggestions and genetic diversity analysis coming soon.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tree Statistics</h3>
              <p className="text-muted-foreground">
                Comprehensive family tree statistics and inbreeding analysis.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
