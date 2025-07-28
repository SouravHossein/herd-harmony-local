
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface PedigreeControlsProps {
  selectedGoat: string;
  generations: number;
  showPaternal: boolean;
  showMaternal: boolean;
  onGoatChange: (goatId: string) => void;
  onGenerationsChange: (generations: number) => void;
  onPaternalToggle: (show: boolean) => void;
  onMaternalToggle: (show: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onExportPNG: () => void;
  goats: Array<{ id: string; name: string; tagNumber: string }>;
}

export function PedigreeControls({
  selectedGoat,
  generations,
  showPaternal,
  showMaternal,
  onGoatChange,
  onGenerationsChange,
  onPaternalToggle,
  onMaternalToggle,
  onZoomIn,
  onZoomOut,
  onFitView,
  onExportPNG,
  goats
}: PedigreeControlsProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="goat-select">Goat:</Label>
            <Select value={selectedGoat} onValueChange={onGoatChange}>
              <SelectTrigger id="goat-select" className="w-48">
                <SelectValue placeholder="Select a goat" />
              </SelectTrigger>
              <SelectContent>
                {goats.map(goat => (
                  <SelectItem key={goat.id} value={goat.id}>
                    {goat.name} (#{goat.tagNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="generations-select">Generations:</Label>
            <Select value={generations.toString()} onValueChange={(value) => onGenerationsChange(parseInt(value))}>
              <SelectTrigger id="generations-select" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="paternal" 
                checked={showPaternal} 
                onCheckedChange={onPaternalToggle}
              />
              <Label htmlFor="paternal">Paternal</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="maternal" 
                checked={showMaternal} 
                onCheckedChange={onMaternalToggle}
              />
              <Label htmlFor="maternal">Maternal</Label>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onFitView}>
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onExportPNG}>
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
