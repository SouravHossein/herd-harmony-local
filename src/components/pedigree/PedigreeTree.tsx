import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PedigreeNode as PedigreeNodeComponent } from './PedigreeNode';
import { Goat, PedigreeNode } from '@/types/goat';

const nodeTypes = {
  pedigree: PedigreeNodeComponent,
};

interface PedigreeTreeProps {
  goats: Goat[];
  selectedGoatId: string | null;
  onGoatSelect: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeTree({ 
  goats, 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight 
}: PedigreeTreeProps) {
  const { nodes, edges } = useMemo(() => {
    if (!selectedGoatId) {
      return { nodes: [], edges: [] };
    }

    const selectedGoat = goats.find(g => g.id === selectedGoatId);
    if (!selectedGoat) {
      return { nodes: [], edges: [] };
    }

    const pedigreeNodes: Node[] = [];
    const pedigreeEdges: Edge[] = [];

    // Helper function to create a node
    const createNode = (goat: Goat | null, position: { x: number; y: number }, generation: number): Node => {
      if (!goat) {
        return {
          id: `unknown-${Math.random()}`,
          type: 'pedigree',
          position,
          data: {
            goat: null,
            generation,
            isUnknown: true,
            onGoatSelect,
            onShowHealth,
            onShowWeight,
          },
        };
      }

      return {
        id: goat.id,
        type: 'pedigree',
        position,
        data: {
          goat,
          generation,
          onGoatSelect,
          onShowHealth,
          onShowWeight,
        },
      };
    };

    // Build pedigree tree (3 generations)
    const buildPedigree = (goat: Goat, x: number, y: number, generation: number, maxGeneration: number = 3) => {
      const node = createNode(goat, { x, y }, generation);
      pedigreeNodes.push(node);

      if (generation < maxGeneration) {
        const nodeSpacing = 300;
        const verticalSpacing = 150;

        // Father (top)
        const father = goat.fatherId ? goats.find(g => g.id === goat.fatherId) : null;
        const fatherY = y - verticalSpacing;
        const fatherX = x + nodeSpacing;
        
        if (father) {
          buildPedigree(father, fatherX, fatherY, generation + 1, maxGeneration);
          pedigreeEdges.push({
            id: `${goat.id}-${father.id}`,
            source: father.id,
            target: goat.id,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            label: 'Father',
          });
        } else {
          const unknownFatherNode = createNode(null, { x: fatherX, y: fatherY }, generation + 1);
          unknownFatherNode.id = `unknown-father-${goat.id}`;
          pedigreeNodes.push(unknownFatherNode);
        }

        // Mother (bottom)
        const mother = goat.motherId ? goats.find(g => g.id === goat.motherId) : null;
        const motherY = y + verticalSpacing;
        const motherX = x + nodeSpacing;
        
        if (mother) {
          buildPedigree(mother, motherX, motherY, generation + 1, maxGeneration);
          pedigreeEdges.push({
            id: `${goat.id}-${mother.id}`,
            source: mother.id,
            target: goat.id,
            style: { stroke: '#ec4899', strokeWidth: 2 },
            label: 'Mother',
          });
        } else {
          const unknownMotherNode = createNode(null, { x: motherX, y: motherY }, generation + 1);
          unknownMotherNode.id = `unknown-mother-${goat.id}`;
          pedigreeNodes.push(unknownMotherNode);
        }
      }
    };

    buildPedigree(selectedGoat, 0, 0, 0);

    return { nodes: pedigreeNodes, edges: pedigreeEdges };
  }, [goats, selectedGoatId, onGoatSelect, onShowHealth, onShowWeight]);

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update nodes when the computed nodes change
  React.useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.isUnknown) return '#9ca3af';
            if ((node.data?.goat as Goat)?.gender === 'male') return '#3b82f6';
            return '#ec4899';
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}