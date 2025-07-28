
import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
  ConnectionMode,
} from '@xyflow/react';
import { PedigreeNode } from './PedigreeNode';
import { PedigreeControls } from './PedigreeControls';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Goat } from '@/types/goat';

interface PedigreeTreeProps {
  goats: Goat[];
  selectedGoatId: string;
  onGoatSelect: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

interface GoatNodeData {
  goat: Goat;
  onClick: (goat: Goat) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

type GoatNode = Node<GoatNodeData>;

export function PedigreeTree({ 
  goats, 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight 
}: PedigreeTreeProps) {
  const [generations, setGenerations] = useState(3);
  const [showMalesOnly, setShowMalesOnly] = useState(false);
  const [showFemalesOnly, setShowFemalesOnly] = useState(false);

  const selectedGoat = goats.find(g => g.id === selectedGoatId);

  const buildPedigreeTree = useCallback((rootGoat: Goat, maxGenerations: number) => {
    const nodes: GoatNode[] = [];
    const edges: Edge[] = [];
    const processedGoats = new Set<string>();

    const levelWidth = 280;
    const levelHeight = 120;

    function addGoatNode(goat: Goat, x: number, y: number, generation: number) {
      if (processedGoats.has(goat.id) || generation > maxGenerations) return;
      
      processedGoats.add(goat.id);

      // Filter by gender if specified
      if (showMalesOnly && goat.gender !== 'male') return;
      if (showFemalesOnly && goat.gender !== 'female') return;

      nodes.push({
        id: goat.id,
        type: 'goatNode',
        position: { x, y },
        data: {
          goat,
          onClick: onGoatSelect,
          onShowHealth,
          onShowWeight
        }
      });

      // Add parent connections (simplified - in real implementation, you'd track sire/dam relationships)
      const parents = goats.filter(g => 
        // This is a simplified relationship check - in real implementation, 
        // you'd have proper sire/dam fields in your data model
        g.id !== goat.id && 
        new Date(g.dateOfBirth) < new Date(goat.dateOfBirth)
      ).slice(0, 2); // Take first 2 as mock parents

      parents.forEach((parent, index) => {
        const parentY = y - levelHeight;
        const parentX = x + (index === 0 ? -levelWidth : levelWidth);
        
        if (generation < maxGenerations) {
          addGoatNode(parent, parentX, parentY, generation + 1);
          
          edges.push({
            id: `${parent.id}-${goat.id}`,
            source: parent.id,
            target: goat.id,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#8B5CF6', strokeWidth: 2 }
          });
        }
      });
    }

    if (rootGoat) {
      addGoatNode(rootGoat, 0, 0, 1);
    }

    return { nodes, edges };
  }, [goats, onGoatSelect, onShowHealth, onShowWeight, showMalesOnly, showFemalesOnly]);

  const { nodes, edges } = useMemo(() => {
    if (!selectedGoat) return { nodes: [], edges: [] };
    return buildPedigreeTree(selectedGoat, generations);
  }, [selectedGoat, generations, buildPedigreeTree]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const nodeTypes: NodeTypes = useMemo(() => ({
    goatNode: PedigreeNode,
  }), []);

  const exportTree = () => {
    // In a real implementation, you'd export the tree as PDF or image
    console.log('Exporting pedigree tree...');
    // For now, just log the data
    console.log('Nodes:', reactFlowNodes);
    console.log('Edges:', reactFlowEdges);
  };

  if (!selectedGoat) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <p>Select a goat to view its pedigree tree</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PedigreeControls
        generations={generations}
        onGenerationsChange={setGenerations}
        showMalesOnly={showMalesOnly}
        onShowMalesOnlyChange={setShowMalesOnly}
        showFemalesOnly={showFemalesOnly}
        onShowFemalesOnlyChange={setShowFemalesOnly}
      />
      
      <div className="h-96 border rounded-lg bg-background">
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportTree}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
