
import React, { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGoatContext } from '@/context/GoatContext';
import PedigreeNode from './PedigreeNode';
import PedigreeControls from './PedigreeControls';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GoatNodeData extends Record<string, unknown> {
  goat: {
    id: string;
    name: string;
    breed: string;
    tagNumber: string;
    gender: 'male' | 'female';
    dateOfBirth: Date;
    color: string;
    status: 'active' | 'sold' | 'deceased';
  };
  onShowHealth?: (goatId: string) => void;
  onShowWeight?: (goatId: string) => void;
  level: number;
  position: 'sire' | 'dam' | 'offspring';
}

interface GoatNode extends Node {
  data: GoatNodeData;
}

const nodeTypes = {
  goat: PedigreeNode,
};

interface PedigreeTreeProps {
  selectedGoatId: string | null;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeTree({ selectedGoatId, onShowHealth, onShowWeight }: PedigreeTreeProps) {
  const { goats } = useGoatContext();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [generations, setGenerations] = useState(2);
  const [showMalesOnly, setShowMalesOnly] = useState(false);
  const [showFemalesOnly, setShowFemalesOnly] = useState(false);

  const buildPedigreeTree = useCallback(() => {
    if (!selectedGoatId) return;

    const selectedGoat = goats.find(g => g.id === selectedGoatId);
    if (!selectedGoat) return;

    const newNodes: GoatNode[] = [];
    const newEdges: Edge[] = [];

    // Add the selected goat as the root node
    newNodes.push({
      id: selectedGoat.id,
      type: 'goat',
      position: { x: 400, y: 50 },
      data: {
        goat: selectedGoat,
        onShowHealth,
        onShowWeight,
        level: 0,
        position: 'offspring',
      },
    });

    // Build the tree recursively
    const addParents = (goatId: string, level: number, baseX: number, baseY: number) => {
      if (level >= generations) return;

      const goat = goats.find(g => g.id === goatId);
      if (!goat) return;

      // Find parents (this would require breeding records or parent fields)
      // For now, we'll simulate with a basic relationship
      const parents = goats.filter(g => 
        g.id !== goatId && 
        new Date(g.dateOfBirth) < new Date(goat.dateOfBirth) &&
        g.status === 'active'
      ).slice(0, 2);

      if (parents.length > 0) {
        const spacing = 300 / (level + 1);
        
        parents.forEach((parent, index) => {
          if (showMalesOnly && parent.gender !== 'male') return;
          if (showFemalesOnly && parent.gender !== 'female') return;

          const xOffset = index === 0 ? -spacing : spacing;
          const nodeId = `${parent.id}-${level}`;
          
          newNodes.push({
            id: nodeId,
            type: 'goat',
            position: { 
              x: baseX + xOffset, 
              y: baseY + 150 + (level * 100) 
            },
            data: {
              goat: parent,
              onShowHealth,
              onShowWeight,
              level: level + 1,
              position: parent.gender === 'male' ? 'sire' : 'dam',
            },
          });

          // Add edge from parent to offspring
          newEdges.push({
            id: `${nodeId}-${goatId}`,
            source: nodeId,
            target: goatId,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: {
              stroke: parent.gender === 'male' ? '#3b82f6' : '#ec4899',
              strokeWidth: 2,
            },
          });

          // Recursively add parents
          addParents(parent.id, level + 1, baseX + xOffset, baseY + 150 + (level * 100));
        });
      }
    };

    addParents(selectedGoat.id, 0, 400, 50);

    setNodes(newNodes as Node[]);
    setEdges(newEdges);
  }, [selectedGoatId, goats, generations, showMalesOnly, showFemalesOnly, onShowHealth, onShowWeight]);

  useEffect(() => {
    buildPedigreeTree();
  }, [buildPedigreeTree]);

  if (!selectedGoatId) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please select a goat from the sidebar to view its pedigree tree.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-4">
      <PedigreeControls
        generations={generations}
        onGenerationsChange={setGenerations}
        showMalesOnly={showMalesOnly}
        onShowMalesOnlyChange={setShowMalesOnly}
        showFemalesOnly={showFemalesOnly}
        onShowFemalesOnlyChange={setShowFemalesOnly}
      />
      
      <div className="h-[600px] border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 50 }}
          className="bg-background"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
