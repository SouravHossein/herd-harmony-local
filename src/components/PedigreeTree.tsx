
import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  ConnectionMode,
  Position,
} from '@xyflow/react';
import { PedigreeNode } from './PedigreeNode';
import { PedigreeControls } from './PedigreeControls';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import '@xyflow/react/dist/style.css';

interface PedigreeTreeProps {
  selectedGoatId: string | null;
  onGoatSelect: (goatId: string) => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeTree({ 
  selectedGoatId, 
  onGoatSelect, 
  onShowHealth, 
  onShowWeight 
}: PedigreeTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState(3);
  const [showMaternal, setShowMaternal] = useState(true);
  const [showPaternal, setShowPaternal] = useState(true);
  const { toast } = useToast();

  const nodeTypes: NodeTypes = {
    pedigreeNode: PedigreeNode,
  };

  const loadPedigreeTree = useCallback(async () => {
    if (!selectedGoatId) return;
    
    setLoading(true);
    try {
      // Check if electron API is available
      if (window.electronAPI?.getPedigreeTree) {
        const treeData = await window.electronAPI.getPedigreeTree(selectedGoatId, generations);
        
        // Filter nodes based on lineage settings
        const filteredNodes = treeData.nodes.filter((node: any) => {
          if (node.id === selectedGoatId) return true;
          if (!showMaternal && node.data.lineage === 'maternal') return false;
          if (!showPaternal && node.data.lineage === 'paternal') return false;
          return true;
        });

        // Filter edges to match filtered nodes
        const nodeIds = new Set(filteredNodes.map((n: any) => n.id));
        const filteredEdges = treeData.edges.filter((edge: any) => 
          nodeIds.has(edge.source) && nodeIds.has(edge.target)
        );

        // Transform nodes to include onClick handler
        const transformedNodes = filteredNodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onClick: () => onGoatSelect(node.id),
            onShowHealth: () => onShowHealth(node.id),
            onShowWeight: () => onShowWeight(node.id),
          }
        }));

        setNodes(transformedNodes);
        setEdges(filteredEdges);
      } else {
        // Fallback for web version - create a simple tree structure
        const fallbackNodes = [
          {
            id: selectedGoatId,
            type: 'pedigreeNode',
            position: { x: 300, y: 200 },
            data: {
              name: 'Selected Goat',
              breed: 'Unknown',
              gender: 'unknown',
              status: 'active',
              onClick: () => onGoatSelect(selectedGoatId),
              onShowHealth: () => onShowHealth(selectedGoatId),
              onShowWeight: () => onShowWeight(selectedGoatId),
            }
          }
        ];
        setNodes(fallbackNodes);
        setEdges([]);
      }
    } catch (error) {
      console.error('Error loading pedigree tree:', error);
      toast({
        title: "Error",
        description: "Failed to load pedigree tree",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedGoatId, generations, showMaternal, showPaternal, onGoatSelect, onShowHealth, onShowWeight, toast]);

  useEffect(() => {
    loadPedigreeTree();
  }, [loadPedigreeTree]);

  const handleExport = async (format: 'png' | 'pdf') => {
    try {
      // Implementation for export functionality
      toast({
        title: "Export",
        description: `Exporting pedigree as ${format.toUpperCase()}...`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export pedigree",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading pedigree tree...</p>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PedigreeControls
        generations={generations}
        onGenerationsChange={setGenerations}
        showMaternal={showMaternal}
        onShowMaternalChange={setShowMaternal}
        showPaternal={showPaternal}
        onShowPaternalChange={setShowPaternal}
        onExport={handleExport}
      />
      
      <div className="flex-1 border rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
          }}
          className="bg-background"
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const status = node.data?.status || 'active';
              return status === 'active' ? '#22c55e' : 
                     status === 'deceased' ? '#6b7280' : '#3b82f6';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
