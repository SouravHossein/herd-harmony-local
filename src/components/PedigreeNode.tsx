
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface GoatNodeData extends Record<string, unknown> {
  goat: {
    id: string;
    name: string;
    breed: string;
    tagNumber: string;
    gender: 'male' | 'female';
    dateOfBirth: Date;
    color: string;
    status: 'active' | 'sold' | 'deceased';
  };
  onShowHealth?: (goatId: string) => void;
  onShowWeight?: (goatId: string) => void;
  level: number;
  position: 'sire' | 'dam' | 'offspring';
}

interface GoatNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: GoatNodeData;
}

const PedigreeNode = memo(({ data }: { data: GoatNodeData }) => {
  const { goat, onShowHealth, onShowWeight, level, position } = data;
  
  const getNodeColor = () => {
    if (goat.gender === 'male') return 'bg-blue-50 border-blue-200';
    return 'bg-pink-50 border-pink-200';
  };

  const getGenerationLabel = () => {
    if (level === 0) return 'Individual';
    if (level === 1) return 'Parents';
    if (level === 2) return 'Grandparents';
    return `Generation ${level}`;
  };

  const age = Math.floor((new Date().getTime() - new Date(goat.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <Card className={`w-64 shadow-lg ${getNodeColor()}`}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{goat.name}</h3>
            <Badge variant={goat.gender === 'male' ? 'default' : 'secondary'}>
              {goat.gender === 'male' ? '♂' : '♀'}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Tag: #{goat.tagNumber}</p>
            <p>Breed: {goat.breed}</p>
            <p>Age: {age} years</p>
            <p>Color: {goat.color}</p>
            <p>Level: {getGenerationLabel()}</p>
          </div>

          <Badge 
            variant={goat.status === 'active' ? 'default' : 'outline'}
            className="text-xs"
          >
            {goat.status}
          </Badge>

          <div className="flex space-x-1 mt-2">
            {onShowHealth && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowHealth(goat.id)}
                className="flex-1"
              >
                <Heart className="h-3 w-3 mr-1" />
                Health
              </Button>
            )}
            {onShowWeight && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowWeight(goat.id)}
                className="flex-1"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Weight
              </Button>
            )}
          </div>
        </div>

        {/* Connection handles */}
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
      </CardContent>
    </Card>
  );
});

PedigreeNode.displayName = 'PedigreeNode';

export default PedigreeNode;
