
import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, TrendingUp, Copy } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useImageStorage } from '@/hooks/useImageStorage';
import { toast } from '@/components/ui/use-toast';

interface GoatNodeData extends Record<string, unknown> {
  goat: {
    id: string;
    name: string;
    breed: string;
    tagNumber: string;
    gender: 'male' | 'female';
    dateOfBirth: Date;
    color: string;
    status: 'active' | 'sold' | 'deceased' | 'archived';
    imageId?: string;
  } | null;
  generation: number;
  isUnknown?: boolean;
  onGoatSelect?: (goat: any) => void;
  onShowHealth?: (goatId: string) => void;
  onShowWeight?: (goatId: string) => void;
  fatherImageUrl?: string | null;
}

const PedigreeNode = memo(({ data }: { data: GoatNodeData }) => {
  const { goat, generation, isUnknown, onGoatSelect, onShowHealth, onShowWeight, fatherImageUrl } = data;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { getImage } = useImageStorage();

  useEffect(() => {
    if (goat?.imageId) {
      getImage(goat.imageId).then(url => {
        if (url) setImageUrl(url);
      }).catch(err => {
        console.warn('Failed to load image for goat:', goat.name, err);
        setImageUrl(null);
      });
    } else {
      setImageUrl(null);
    }
  }, [goat?.imageId, getImage]);

  if (isUnknown || !goat) {
    return (
      <Card className="w-64 shadow-lg bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <p className="font-medium">Unknown</p>
            <p className="text-xs">Generation {generation}</p>
          </div>
          <Handle type="target" position={Position.Right} className="w-3 h-3 bg-gray-400" />
        </CardContent>
      </Card>
    );
  }
  
  const getNodeColor = () => {
    if (goat.gender === 'male') return 'bg-blue-50 border-blue-200';
    return 'bg-pink-50 border-pink-200';
  };

  const getGenerationLabel = () => {
    if (generation === 0) return 'Individual';
    if (generation === 1) return 'Parents';
    if (generation === 2) return 'Grandparents';
    return `Generation ${generation}`;
  };

  const copyId = () => {
    navigator.clipboard.writeText(goat.id);
    toast({
      title: "ID copied",
      description: `Copied ${goat.name}'s ID to clipboard`,
    });
  };

  const age = Math.floor((new Date().getTime() - new Date(goat.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <Card className={`w-64 shadow-lg ${getNodeColor()}`}>
      <CardContent className="p-4">
<div className="space-y-2">
  {(imageUrl || fatherImageUrl) && (
    <div className="flex justify-center relative">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={goat.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
        />
      )}
      {fatherImageUrl && (
        <img
          src={fatherImageUrl}
          alt="Father"
          title="Father"
          className="w-6 h-6 rounded-full object-cover border-2 border-background shadow absolute -top-1 -right-1"
        />
      )}
    </div>
  )}
          
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{goat.name}</h3>
            <div className="flex items-center space-x-1">
              <Badge variant={goat.gender === 'male' ? 'default' : 'secondary'}>
                {goat.gender === 'male' ? '♂' : '♀'}
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyId}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
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

        <Handle type="target" position={Position.Right} className="w-3 h-3 bg-primary" />
        <Handle type="source" position={Position.Left} className="w-3 h-3 bg-primary" />
      </CardContent>
    </Card>
  );
});

PedigreeNode.displayName = 'PedigreeNode';

export default PedigreeNode;
