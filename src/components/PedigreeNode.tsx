
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Weight, User, Calendar } from 'lucide-react';

interface GoatNodeData {
  name: string;
  breed: string;
  gender: 'male' | 'female' | 'unknown';
  status: 'active' | 'deceased' | 'sold';
  dateOfBirth?: Date;
  photoPath?: string;
  onClick?: () => void;
  onShowHealth?: () => void;
  onShowWeight?: () => void;
}

export function PedigreeNode({ data, selected }: NodeProps<GoatNodeData>) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500 bg-green-50';
      case 'deceased':
        return 'border-gray-500 bg-gray-50';
      case 'sold':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return '♂';
      case 'female':
        return '♀';
      default:
        return '?';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'text-blue-600';
      case 'female':
        return 'text-pink-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-muted-foreground"
      />
      
      <Card 
        className={`
          w-48 cursor-pointer transition-all duration-200 hover:shadow-lg
          ${getStatusColor(data.status)}
          ${selected ? 'ring-2 ring-primary' : ''}
        `}
        onClick={data.onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold ${getGenderColor(data.gender)}`}>
                {getGenderIcon(data.gender)}
              </span>
              <Badge variant="outline" className="text-xs">
                {data.status}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {data.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {data.breed}
            </p>
            {data.dateOfBirth && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(data.dateOfBirth).getFullYear()}</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-1 mt-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                data.onShowHealth?.();
              }}
            >
              <Heart className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                data.onShowWeight?.();
              }}
            >
              <Weight className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                data.onClick?.();
              }}
            >
              <User className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-muted-foreground"
      />
    </div>
  );
}
