
import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PedigreeNode } from './PedigreeNode';
import { PedigreeControls } from './PedigreeControls';
import { PedigreeSidebar } from './PedigreeSidebar';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';

const nodeTypes = {
  pedigreeNode: PedigreeNode,
};

interface PedigreeTreeProps {
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeTree({ onShowHealth, onShowWeight }: PedigreeTreeProps) {
  const { goats } = useGoatContext();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedGoat, setSelectedGoat] = useState<string>('');
  const [generations, setGenerations] = useState(3);
  const [showPaternal, setShowPaternal] = useState(true);
  const [showMaternal, setShowMaternal] = useState(true);
  const [sidebarGoat, setSidebarGoat] = useState<Goat | null>(null);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const loadPedigreeTree = useCallback(async (goatId: string, gens: number) => {
    if (!goatId || !window.electronAPI?.isElectron) return;

    try {
      const { nodes: treeNodes, edges: treeEdges } = await window.electronAPI.getPedigreeTree(goatId, gens);
      
      // Filter based on lineage toggles
      const filteredNodes = treeNodes.filter((node: any) => {
        const breeding = node.data.breeding;
        if (!breeding) return true; // Keep the root node
        
        // Logic to filter paternal/maternal lines would go here
        // For now, show all nodes
        return true;
      });
      
      const filteredEdges = treeEdges.filter((edge: any) => {
        const sourceExists = filteredNodes.some((node: any) => node.id === edge.source);
        const targetExists = filteredNodes.some((node: any) => node.id === edge.target);
        return sourceExists && targetExists;
      });
      
      setNodes(filteredNodes);
      setEdges(filteredEdges);
      
      // Fit view after a small delay to ensure nodes are rendered
      setTimeout(() => fitView(), 100);
    } catch (error) {
      console.error('Error loading pedigree tree:', error);
    }
  }, [setNodes, setEdges, fitView]);

  const handleGoatChange = (goatId: string) => {
    setSelectedGoat(goatId);
    loadPedigreeTree(goatId, generations);
  };

  const handleGenerationsChange = (gens: number) => {
    setGenerations(gens);
    if (selectedGoat) {
      loadPedigreeTree(selectedGoat, gens);
    }
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const goat = goats.find(g => g.id === node.id);
    if (goat) {
      setSidebarGoat(goat);
    }
  }, [goats]);

  const handleExportPNG = useCallback(() => {
    // This would integrate with html2canvas for export functionality
    // For now, we'll just show a placeholder
    console.log('Export PNG functionality to be implemented');
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <PedigreeControls
          selectedGoat={selectedGoat}
          generations={generations}
          showPaternal={showPaternal}
          showMaternal={showMaternal}
          onGoatChange={handleGoatChange}
          onGenerationsChange={handleGenerationsChange}
          onPaternalToggle={setShowPaternal}
          onMaternalToggle={setShowMaternal}
          onZoomIn={() => zoomIn()}
          onZoomOut={() => zoomOut()}
          onFitView={() => fitView()}
          onExportPNG={handleExportPNG}
          goats={goats.map(g => ({ id: g.id, name: g.name, tagNumber: g.tagNumber }))}
        />
        
        <div className="flex-1 border border-border rounded-lg overflow-hidden">
          <ReactFlow
            ref={reactFlowRef}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
      
      {sidebarGoat && (
        <PedigreeSidebar
          goat={sidebarGoat}
          onClose={() => setSidebarGoat(null)}
          onShowHealth={onShowHealth}
          onShowWeight={onShowWeight}
        />
      )}
    </div>
  );
}
