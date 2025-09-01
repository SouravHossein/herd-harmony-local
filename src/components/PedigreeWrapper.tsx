import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import PedigreeNode from '@/components/goats/PedigreeNode';
import { initialNodes, initialEdges } from '@/components/goats/pedigree-utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

const nodeTypes = {
  pedigree: PedigreeNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

interface AllGoatsPedigreeViewProps {
  goats: Goat[];
  onSelectGoat: (goatId: string) => void;
  onBack: () => void;
}

function AllGoatsPedigreeView({ goats, onSelectGoat, onBack }: AllGoatsPedigreeViewProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredGoats = goats.filter((goat) =>
    goat.name.toLowerCase().includes(search.toLowerCase()) ||
    goat.tagNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button variant="ghost" onClick={onBack}>
          Back to Pedigree
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <Search className="mr-2 h-4 w-4 opacity-50" />
              {search ? search : "Search goat..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Type to search..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No goat found.</CommandEmpty>
                <CommandGroup>
                  {filteredGoats.map((goat) => (
                    <CommandItem
                      key={goat.id}
                      value={goat.name}
                      onSelect={() => {
                        onSelectGoat(goat.id);
                        setOpen(false);
                      }}
                    >
                      {goat.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="p-4 overflow-y-auto">
        <ul className="grid grid-cols-3 gap-4">
          {filteredGoats.map((goat) => (
            <li key={goat.id} className="p-2 border rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => onSelectGoat(goat.id)}>
              {goat.name} ({goat.tagNumber})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PedigreeWrapper() {
  const { goats, getPedigreeTree } = useGoatContext();
  const [selectedGoat, setSelectedGoat] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [generations, setGenerations] = useState<number>(3);
  const [showAllGoatsView, setShowAllGoatsView] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGoatSelect = async (goatId: string) => {
    setSelectedGoat(goatId);
    if (goatId) {
      const pedigreeData = await getPedigreeTree(goatId, generations);
      if (pedigreeData) {
        setNodes(pedigreeData.nodes);
        setEdges(pedigreeData.edges);
      }
    }
  };

  const handleGenerationsChange = async (value: number[]) => {
    const newGenerations = value[0];
    setGenerations(newGenerations);
    if (selectedGoat) {
      const pedigreeData = await getPedigreeTree(selectedGoat, newGenerations);
      if (pedigreeData) {
        setNodes(pedigreeData.nodes);
        setEdges(pedigreeData.edges);
      }
    }
  };

  const handleAllGoatsView = () => {
    setShowAllGoatsView(true);
  };

  if (showAllGoatsView) {
    return (
      <div className="h-screen overflow-hidden">
        <AllGoatsPedigreeView 
          goats={goats}
          onSelectGoat={(goatId) => {
            setSelectedGoat(goatId);
            setShowAllGoatsView(false);
          }}
          onBack={() => setShowAllGoatsView(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {selectedGoat
                  ? `Selected Goat: ${goats.find((g) => g.id === selectedGoat)?.name}`
                  : 'Select a Goat'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select a Goat</DialogTitle>
                <DialogDescription>
                  Choose a goat to display its pedigree tree.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {goats.map((goat) => (
                  <Button
                    key={goat.id}
                    variant="ghost"
                    className="w-full"
                    onClick={() => handleGoatSelect(goat.id)}
                  >
                    {goat.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="secondary" onClick={handleAllGoatsView}>
            View All Goats
          </Button>
        </div>

        <div>
          <Label htmlFor="generations" className="block text-sm font-medium text-gray-700">
            Generations: {generations}
          </Label>
          <Slider
            id="generations"
            defaultValue={[generations]}
            max={5}
            min={1}
            step={1}
            onValueChange={handleGenerationsChange}
            className="w-48"
          />
        </div>
      </div>

      <div className="flex-1" style={{ height: 'calc(100vh - 80px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          onLoad={(_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance)}
          fitView
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
