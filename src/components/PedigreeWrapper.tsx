
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PedigreeTree from './PedigreeTree';
import PedigreeEditor from './PedigreeEditor';
import { PedigreeSidebar } from './PedigreeSidebar';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';

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
            Explore lineage, edit relationships, and analyze genetic diversity
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

      {/* Main Content */}
      <Tabs defaultValue="tree" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tree">Family Tree</TabsTrigger>
          <TabsTrigger value="editor">Edit Pedigree</TabsTrigger>
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

        <TabsContent value="editor">
          <div className="flex gap-6">
            <div className="flex-1">
              <PedigreeEditor
                selectedGoat={selectedGoat}
                goats={goats}
                onUpdateGoat={updateGoat}
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
      </Tabs>
    </div>
  );
}
