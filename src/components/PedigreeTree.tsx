
import React, { useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Node,
  Edge
} from '@xyflow/react';
import { PedigreeNode } from './PedigreeNode';
import { PedigreeControls } from './PedigreeControls';
import { Goat } from '@/types/goat';
import { useGoatData } from '@/hooks/useDatabase';

interface PedigreeTreeProps {
  selectedGoatId?: string;
  onGoatSelect: (goatId: string) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

const nodeTypes = {
  goatNode: PedigreeNode,
};

export function PedigreeTree({ 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight 
}: PedigreeTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [generations, setGenerations] = useState(3);
  const [showMaternal, setShowMaternal] = useState(true);
  const [showPaternal, setShowPaternal] = useState(true);
  
  const { goats, breedingRecords, loading } = useGoatData();

  useEffect(() => {
    if (selectedGoatId && goats.length > 0) {
      const tree = buildPedigreeTree(selectedGoatId, generations);
      setNodes(tree.nodes);
      setEdges(tree.edges);
    }
  }, [selectedGoatId, generations, showMaternal, showPaternal, goats, breedingRecords]);

  const buildPedigreeTree = (goatId: string, maxGenerations: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const processedGoats = new Set<string>();

    const addGoatNode = (goat: Goat, generation: number, x: number, y: number) => {
      if (processedGoats.has(goat.id) || generation > maxGenerations) return;
      
      processedGoats.add(goat.id);

      nodes.push({
        id: goat.id,
        type: 'goatNode',
        position: { x, y },
        data: {
          goat,
          onClick: () => onGoatSelect(goat.id),
          onShowHealth,
          onShowWeight
        }
      });

      // Find parents
      const breeding = breedingRecords.find(record => 
        record.kidIds.includes(goat.id)
      );

      if (breeding && generation < maxGenerations) {
        const sire = goats.find(g => g.id === breeding.sireId);
        const dam = goats.find(g => g.id === breeding.damId);

        if (sire && showPaternal) {
          addGoatNode(sire, generation + 1, x - 150, y - 120);
          edges.push({
            id: `${sire.id}-${goat.id}`,
            source: sire.id,
            target: goat.id,
            type: 'smoothstep'
          });
        }

        if (dam && showMaternal) {
          addGoatNode(dam, generation + 1, x + 150, y - 120);
          edges.push({
            id: `${dam.id}-${goat.id}`,
            source: dam.id,
            target: goat.id,
            type: 'smoothstep'
          });
        }
      }
    };

    const selectedGoat = goats.find(g => g.id === goatId);
    if (selectedGoat) {
      addGoatNode(selectedGoat, 1, 0, 0);
    }

    return { nodes, edges };
  };

  const handleExport = async (format: 'png' | 'pdf') => {
    // Implementation for export functionality
    console.log(`Exporting pedigree as ${format}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading pedigree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 rounded-lg">
      <PedigreeControls
        generations={generations}
        onGenerationsChange={setGenerations}
        showMaternal={showMaternal}
        onShowMaternalChange={setShowMaternal}
        showPaternal={showPaternal}
        onShowPaternalChange={setShowPaternal}
        onExport={handleExport}
      />
      
      <div className="h-96 border rounded-lg bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
