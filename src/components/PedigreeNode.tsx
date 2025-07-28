
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PedigreeNodeProps {
  data: {
    goat: {
      id: string;
      name: string;
      breed: string;
      gender: 'male' | 'female';
      status: 'active' | 'sold' | 'deceased';
      photoPath?: string;
    };
    generation: number;
  };
  selected: boolean;
}

export function PedigreeNode({ data, selected }: PedigreeNodeProps) {
  const { goat, generation } = data;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500';
      case 'sold': return 'border-blue-500';
      case 'deceased': return 'border-gray-500';
      default: return 'border-gray-300';
    }
  };

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700';
  };

  return (
    <Card className={cn(
      'w-48 h-32 cursor-pointer transition-all hover:shadow-lg',
      getStatusColor(goat.status),
      'border-2',
      selected && 'ring-2 ring-primary ring-offset-2'
    )}>
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-muted-foreground">
            Gen {generation}
          </div>
          <Badge variant="outline" className={getGenderColor(goat.gender)}>
            {goat.gender === 'male' ? '♂' : '♀'}
          </Badge>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="font-semibold text-sm truncate mb-1">
              {goat.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {goat.breed}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {goat.status}
          </Badge>
        </div>
      </CardContent>
      
      <Handle type="target" position={Position.Right} className="w-2 h-2" />
      <Handle type="source" position={Position.Left} className="w-2 h-2" />
    </Card>
  );
}
