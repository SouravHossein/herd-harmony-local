
import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Node, 
  Edge, 
  Controls, 
  Background, 
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
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
  generations?: number;
}

interface PedigreeNodeData extends Record<string, unknown> {
  goat: Goat | null;
  generation: number;
  isUnknown?: boolean;
  onGoatSelect: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export default function PedigreeTree({ 
  goats, 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight,
  generations = 3
}: PedigreeTreeProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const selectedGoat = goats.find(g => g.id === selectedGoatId);
    if (!selectedGoat) return { nodes: [], edges: [] };

    const nodes: Node<PedigreeNodeData>[] = [];
    const edges: Edge[] = [];
    const processedGoats = new Set<string>();

    const addGoatNode = (
      goat: Goat | null, 
      x: number, 
      y: number, 
      generation: number,
      isUnknown = false
    ): string => {
      const nodeId = goat?.id || `unknown-${Math.random()}`;
      
      if (goat && processedGoats.has(goat.id)) return nodeId;
      if (goat) processedGoats.add(goat.id);

nodes.push({
  id: nodeId,
  type: 'pedigree',
  position: { x, y },
  data: {
    goat,
    generation,
    isUnknown,
    onGoatSelect,
    onShowHealth,
    onShowWeight,
    fatherImageUrl: (goat?.fatherId ? (goats.find(g => g.id === goat.fatherId)?.mediaFiles?.find(m => m.type === 'image')?.url || null) : null),
  },
});

      return nodeId;
    };

    const buildPedigree = (
      goat: Goat | null, 
      x: number, 
      y: number, 
      generation: number
    ): string => {
      if (!goat || generation >= generations) return '';

      const nodeId = addGoatNode(goat, x, y, generation);

if (generation < generations - 1) {
  const generationSpacing = 250;

  // Only traverse maternal line
  const mother = goat.motherId ? goats.find(g => g.id === goat.motherId) : null;
  const motherY = y; // keep aligned vertically for maternal line
  const motherX = x - generationSpacing;
  
  let motherNodeId: string;
  if (mother) {
    motherNodeId = buildPedigree(mother, motherX, motherY, generation + 1);
  } else {
    motherNodeId = addGoatNode(null, motherX, motherY, generation + 1, true);
  }

  if (motherNodeId) {
    edges.push({
      id: `${motherNodeId}-${nodeId}`,
      source: motherNodeId,
      target: nodeId,
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
      type: 'smoothstep',
    });
  }
}

      return nodeId;
    };

    buildPedigree(selectedGoat, 400, 200, 0);

    return { nodes, edges };
  }, [goats, selectedGoatId, onGoatSelect, onShowHealth, onShowWeight, generations]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

return (
  <div className="w-full h-full">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      edgesUpdatable={false}
      attributionPosition="bottom-left"
      className="bg-background"
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  </div>
);
}
