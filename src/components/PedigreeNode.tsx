
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Heart, Weight, User, Calendar } from 'lucide-react';
import { Goat } from '@/types/goat';
import { calculateAge } from '@/lib/utils';

interface GoatNodeData {
  goat: Goat;
  onClick?: () => void;
  onShowHealth?: (goatId: string) => void;
  onShowWeight?: (goatId: string) => void;
}

export function PedigreeNode({ data, selected }: NodeProps<GoatNodeData>) {
  const { goat, onClick, onShowHealth, onShowWeight } = data;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500';
      case 'deceased': return 'border-gray-500';
      case 'sold': return 'border-blue-500';
      default: return 'border-gray-300';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'male' ? '♂' : '♀';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      deceased: 'bg-gray-100 text-gray-800',
      sold: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-md border-2 p-3 min-w-[200px] cursor-pointer
      ${getStatusColor(goat.status)}
      ${selected ? 'ring-2 ring-blue-400' : ''}
      hover:shadow-lg transition-shadow
    `}>
      <Handle type="target" position={Position.Top} />
      
      <div 
        className="flex items-center space-x-2 mb-2"
        onClick={onClick}
      >
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
          ${goat.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}
        `}>
          {getGenderIcon(goat.gender)}
        </div>
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${getStatusBadge(goat.status)}
        `}>
          {goat.status}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-gray-800">{goat.name}</h3>
        <p className="text-xs text-gray-600">{goat.breed}</p>
        <p className="text-xs text-gray-500">
          {calculateAge(goat.dateOfBirth)}
        </p>
      </div>

      <div className="flex justify-between mt-2 space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowHealth?.(goat.id);
          }}
          className="flex items-center space-x-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
        >
          <Heart className="w-3 h-3" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowWeight?.(goat.id);
          }}
          className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
        >
          <Weight className="w-3 h-3" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="flex items-center space-x-1 px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs hover:bg-gray-100"
        >
          <User className="w-3 h-3" />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
