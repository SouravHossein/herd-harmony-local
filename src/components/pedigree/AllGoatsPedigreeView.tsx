
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  TreePine, 
  Users, 
  Heart, 
  Crown,
  GitBranch,
  Zap
} from 'lucide-react';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';
import PedigreeGoatCard from './PedigreeGoatCard';
import PedigreeSearchFilter from './PedigreeSearchFilter';

interface FamilyTree {
  root: Goat;
  descendants: Goat[];
  generations: number;
  totalAnimals: number;
}

export default function AllGoatsPedigreeView() {
  const { goats } = useGoatContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [focusedGoatId, setFocusedGoatId] = useState<string | null>(null);

  // Build family trees data structure
  const familyTrees = useMemo(() => {
    const trees: FamilyTree[] = [];
    
    // Find foundation animals (goats without mothers)
    const foundationAnimals = goats.filter(goat => !goat.motherId && goat.status === 'active');
    
    foundationAnimals.forEach(root => {
      const descendants = getDescendants(root.id, goats);
      const generations = getMaxGenerations(root.id, goats);
      
      trees.push({
        root,
        descendants,
        generations,
        totalAnimals: descendants.length + 1
      });
    });
    
    return trees.sort((a, b) => b.totalAnimals - a.totalAnimals);
  }, [goats]);

  // Filter family trees based on search criteria
  const filteredTrees = familyTrees.filter(tree => {
    const matchesSearch = !searchTerm || 
      tree.root.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.root.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.descendants.some(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.tagNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesBreed = selectedBreed === 'all' || tree.root.breed === selectedBreed;
    const matchesGender = selectedGender === 'all' || tree.root.gender === selectedGender;
    
    return matchesSearch && matchesBreed && matchesGender;
  });

  const breeds = [...new Set(goats.map(g => g.breed))];
  const totalGoats = goats.filter(g => g.status === 'active').length;
  const totalTrees = familyTrees.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TreePine className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{totalTrees}</span>
            </div>
            <p className="text-sm text-muted-foreground">Family Trees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{totalGoats}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Goats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Crown className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {familyTrees.length > 0 ? Math.max(...familyTrees.map(t => t.generations)) : 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Max Generations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <GitBranch className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {familyTrees.reduce((sum, tree) => sum + tree.totalAnimals, 0)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Lineage</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <PedigreeSearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBreed={selectedBreed}
        onBreedChange={setSelectedBreed}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        generationFilter={generationFilter}
        onGenerationFilterChange={setGenerationFilter}
        breeds={breeds}
      />

      {/* Family Trees Display */}
      <div className="space-y-8">
        {filteredTrees.length > 0 ? (
          filteredTrees.map((tree, treeIndex) => (
            <Card key={tree.root.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <TreePine className="h-6 w-6 text-primary" />
                    <span>Family Tree {treeIndex + 1}: {tree.root.name}</span>
                    <Badge variant="outline">
                      {tree.totalAnimals} animals, {tree.generations} generations
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFocusedGoatId(tree.root.id)}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Focus Tree
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <FamilyTreeView 
                  rootGoat={tree.root} 
                  allGoats={goats}
                  focusedGoatId={focusedGoatId}
                  onGoatClick={setFocusedGoatId}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No family trees match your criteria</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Helper component to render individual family trees
function FamilyTreeView({ 
  rootGoat, 
  allGoats, 
  focusedGoatId, 
  onGoatClick 
}: { 
  rootGoat: Goat; 
  allGoats: Goat[]; 
  focusedGoatId: string | null;
  onGoatClick: (id: string) => void;
}) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([0, 1]));
  
  const toggleLevel = (level: number) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  const renderLevel = (parentGoat: Goat, level: number): React.ReactNode => {
    const children = allGoats.filter(g => g.motherId === parentGoat.id);
    
    if (children.length === 0) return null;

    const isExpanded = expandedLevels.has(level);
    
    return (
      <div className="ml-8 mt-4">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLevel(level)}
            className="text-xs"
          >
            {isExpanded ? '▼' : '▶'} Generation {level + 1} ({children.length})
          </Button>
        </div>
        
        {isExpanded && (
          <div className="space-y-3">
            {children.map(child => (
              <div key={child.id}>
                <PedigreeGoatCard
                  goat={child}
                  level={level + 1}
                  isFocused={focusedGoatId === child.id}
                  onClick={() => onGoatClick(child.id)}
                />
                {renderLevel(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <PedigreeGoatCard
        goat={rootGoat}
        level={0}
        isFocused={focusedGoatId === rootGoat.id}
        onClick={() => onGoatClick(rootGoat.id)}
        isFoundation
      />
      {renderLevel(rootGoat, 0)}
    </div>
  );
}

// Helper functions
function getDescendants(goatId: string, allGoats: Goat[]): Goat[] {
  const descendants: Goat[] = [];
  
  const findChildren = (parentId: string) => {
    const children = allGoats.filter(goat => goat.motherId === parentId);
    children.forEach(child => {
      descendants.push(child);
      findChildren(child.id);
    });
  };
  
  findChildren(goatId);
  return descendants;
}

function getMaxGenerations(goatId: string, allGoats: Goat[]): number {
  let maxDepth = 0;
  
  const findDepth = (parentId: string, depth: number) => {
    const children = allGoats.filter(goat => goat.motherId === parentId);
    if (children.length === 0) {
      maxDepth = Math.max(maxDepth, depth);
      return;
    }
    
    children.forEach(child => {
      findDepth(child.id, depth + 1);
    });
  };
  
  findDepth(goatId, 0);
  return maxDepth;
}
