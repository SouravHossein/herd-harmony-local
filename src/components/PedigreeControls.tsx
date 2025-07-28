
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download } from 'lucide-react';

export interface PedigreeControlsProps {
  generations: number;
  onGenerationsChange: (generations: number) => void;
  showMaternal: boolean;
  onShowMaternalChange: (show: boolean) => void;
  showPaternal: boolean;
  onShowPaternalChange: (show: boolean) => void;
  onExport: (format: 'png' | 'pdf') => Promise<void>;
}

export function PedigreeControls({
  generations,
  onGenerationsChange,
  showMaternal,
  onShowMaternalChange,
  showPaternal,
  onShowPaternalChange,
  onExport
}: PedigreeControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border mb-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="generations">Generations:</Label>
        <Select 
          value={generations.toString()} 
          onValueChange={(value) => onGenerationsChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="maternal"
          checked={showMaternal}
          onCheckedChange={onShowMaternalChange}
        />
        <Label htmlFor="maternal">Maternal Line</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="paternal"
          checked={showPaternal}
          onCheckedChange={onShowPaternalChange}
        />
        <Label htmlFor="paternal">Paternal Line</Label>
      </div>

      <div className="flex items-center space-x-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('png')}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>PNG</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('pdf')}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>PDF</span>
        </Button>
      </div>
    </div>
  );
}
