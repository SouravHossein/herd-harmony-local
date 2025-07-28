
import React, { useMemo } from 'react';
import ReactFlow, { Node, Edge, Controls, Background, BackgroundVariant } from 'reactflow';
import  PedigreeNode  from './PedigreeNode';
import { Goat } from '@/types/goat';

const nodeTypes = {
  pedigreeNode: PedigreeNode,
};

export interface PedigreeTreeProps {
  pedigreeData: any;
  selectedGoatId: string;
  onGoatSelect: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export const PedigreeTree: React.FC<PedigreeTreeProps> = ({
  pedigreeData,
  selectedGoatId,
  onGoatSelect,
  onShowHealth,
  onShowWeight
}) => {
  const { nodes, edges } = useMemo(() => {
    if (!pedigreeData || !pedigreeData.nodes) {
      return { nodes: [], edges: [] };
    }

    const nodes: Node[] = pedigreeData.nodes.map((node: any) => ({
      id: node.id,
      type: 'pedigreeNode',
      position: node.position,
      data: {
        goat: node.data.goat,
        generation: node.data.generation,
        onGoatSelect,
        onShowHealth,
        onShowWeight,
        isSelected: node.id === selectedGoatId
      }
    }));

    const edges: Edge[] = pedigreeData.edges || [];

    return { nodes, edges };
  }, [pedigreeData, selectedGoatId, onGoatSelect, onShowHealth, onShowWeight]);

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
};
