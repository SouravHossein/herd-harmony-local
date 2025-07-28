
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

interface PedigreeControlsProps {
  generations: number;
  onGenerationsChange: (value: number) => void;
  showMalesOnly: boolean;
  onShowMalesOnlyChange: (value: boolean) => void;
  showFemalesOnly: boolean;
  onShowFemalesOnlyChange: (value: boolean) => void;
}

export default function PedigreeControls({
  generations,
  onGenerationsChange,
  showMalesOnly,
  onShowMalesOnlyChange,
  showFemalesOnly,
  onShowFemalesOnlyChange,
}: PedigreeControlsProps) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Pedigree Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="generations">Generations to Show: {generations}</Label>
          <Slider
            id="generations"
            min={1}
            max={5}
            step={1}
            value={[generations]}
            onValueChange={(value) => onGenerationsChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="males-only"
              checked={showMalesOnly}
              onCheckedChange={onShowMalesOnlyChange}
            />
            <Label htmlFor="males-only">Males Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="females-only"
              checked={showFemalesOnly}
              onCheckedChange={onShowFemalesOnlyChange}
            />
            <Label htmlFor="females-only">Females Only</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
