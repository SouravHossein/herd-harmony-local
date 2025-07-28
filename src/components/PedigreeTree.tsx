
import React, { useMemo } from 'react';
import ReactFlow, { Node, Edge, Controls, Background, BackgroundVariant } from 'reactflow';
import PedigreeNode from './PedigreeNode';
import { Goat } from '@/types/goat';

const nodeTypes = {
  pedigree: PedigreeNode,
};

export interface PedigreeTreeProps {
  goats: Goat[];
  selectedGoatId: string;
  onGoatSelect: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export default function PedigreeTree({ 
  goats, 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight 
}: PedigreeTreeProps) {
  const { nodes, edges } = useMemo(() => {
    const selectedGoat = goats.find(g => g.id === selectedGoatId);
    if (!selectedGoat) return { nodes: [], edges: [] };

    const nodes: Node[] = [
      {
        id: selectedGoat.id,
        type: 'pedigree',
        position: { x: 400, y: 200 },
        data: {
          goat: selectedGoat,
          generation: 0,
          onGoatSelect,
          onShowHealth,
          onShowWeight,
        },
      },
    ];

    const edges: Edge[] = [];

    return { nodes, edges };
  }, [goats, selectedGoatId, onGoatSelect, onShowHealth, onShowWeight]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
