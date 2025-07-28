
import React from 'react';
import { NodeProps, Node } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Weight, Calendar, Info } from 'lucide-react';
import { Goat } from '@/types/goat';

interface GoatNodeData {
  goat: Goat;
  onClick: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

type GoatNode = Node<GoatNodeData>;

export function PedigreeNode({ data, selected }: NodeProps<GoatNode>) {
  const { goat, onClick, onShowHealth, onShowWeight } = data;

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'sold': return 'bg-yellow-500';
      case 'deceased': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`w-64 transition-all duration-200 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">{goat.name}</h3>
            <p className="text-xs text-muted-foreground">#{goat.tagNumber}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge 
              className={`${getGenderColor(goat.gender)} text-white text-xs px-2 py-1`}
            >
              {goat.gender}
            </Badge>
            <Badge 
              className={`${getStatusColor(goat.status)} text-white text-xs px-2 py-1`}
            >
              {goat.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(goat.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {goat.breed} • {goat.color}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClick(goat)}
            className="flex-1 h-8 text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowHealth(goat.id)}
            className="h-8 px-2"
          >
            <Heart className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShowWeight(goat.id)}
            className="h-8 px-2"
          >
            <Weight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
