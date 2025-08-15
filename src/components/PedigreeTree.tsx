
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
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PedigreeNode from './PedigreeNode';
import { Goat } from '@/types/goat';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

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
  fatherImageUrl?: string | null;
  treeDepth?: number;
  totalDescendants?: number;
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

      // Enhanced node data with additional information
      const father = goat?.fatherId ? goats.find(g => g.id === goat.fatherId) : null;
      const fatherImageUrl = father?.mediaFiles?.find(m => m.type === 'image')?.url || null;
      
      // Calculate tree depth and descendants for this goat
      const descendants = goat ? getDescendantCount(goat.id, goats) : 0;
      const treeDepth = goat ? getTreeDepth(goat.id, goats) : 0;

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
          fatherImageUrl,
          treeDepth,
          totalDescendants: descendants,
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
        const generationSpacing = 280; // Increased spacing for better visibility

        // Enhanced maternal line with better positioning
        const mother = goat.motherId ? goats.find(g => g.id === goat.motherId) : null;
        const motherY = y; // Keep aligned vertically for maternal line
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
            style: { 
              stroke: 'hsl(var(--primary))', 
              strokeWidth: 2,
              strokeDasharray: mother ? '0' : '5,5' // Dashed line for unknown mothers
            },
            type: 'smoothstep',
            animated: generation === 0, // Animate only the first generation
            label: generation === 0 ? 'Maternal Line' : undefined,
          });
        }
      }

      return nodeId;
    };

    // Enhanced starting position calculation
    const startX = Math.max(400, generations * 140);
    buildPedigree(selectedGoat, startX, 300, 0);

    return { nodes, edges };
  }, [goats, selectedGoatId, onGoatSelect, onShowHealth, onShowWeight, generations]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        attributionPosition="bottom-left"
        className="bg-background"
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls 
          position="top-left"
          showInteractive={false}
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1}
          color="hsl(var(--muted-foreground))"
          style={{ opacity: 0.3 }}
        />
        <MiniMap 
          position="bottom-right"
          nodeColor={(node) => {
            if (node.data.isUnknown) return 'hsl(var(--muted))';
            if (node.data.generation === 0) return 'hsl(var(--primary))';
            return 'hsl(var(--secondary))';
          }}
          nodeStrokeWidth={2}
          zoomable
          pannable
        />
      </ReactFlow>
      
      {/* Enhanced Tree Info Overlay */}
      <div className="absolute top-4 right-4 bg-card border rounded-lg p-3 shadow-lg">
        <div className="text-sm space-y-1">
          <div className="font-medium">Tree Statistics</div>
          <div className="text-muted-foreground">
            Nodes: {nodes.length} | Generations: {generations}
          </div>
          <div className="text-muted-foreground">
            Maternal Lineage Only
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for enhanced data
function getDescendantCount(goatId: string, allGoats: Goat[]): number {
  let count = 0;
  const findChildren = (parentId: string) => {
    const children = allGoats.filter(goat => goat.motherId === parentId);
    count += children.length;
    children.forEach(child => findChildren(child.id));
  };
  findChildren(goatId);
  return count;
}

function getTreeDepth(goatId: string, allGoats: Goat[]): number {
  let maxDepth = 0;
  const findDepth = (parentId: string, depth: number) => {
    const children = allGoats.filter(goat => goat.motherId === parentId);
    if (children.length === 0) {
      maxDepth = Math.max(maxDepth, depth);
      return;
    }
    children.forEach(child => findDepth(child.id, depth + 1));
  };
  findDepth(goatId, 0);
  return maxDepth;
}
