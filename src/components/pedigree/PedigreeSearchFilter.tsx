
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from 'lucide-react';

interface PedigreeSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBreed: string;
  onBreedChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  generationFilter: string;
  onGenerationFilterChange: (value: string) => void;
  breeds: string[];
}

export default function PedigreeSearchFilter({
  searchTerm,
  onSearchChange,
  selectedBreed,
  onBreedChange,
  selectedGender,
  onGenderChange,
  generationFilter,
  onGenerationFilterChange,
  breeds
}: PedigreeSearchFilterProps) {
  const hasActiveFilters = searchTerm || selectedBreed !== 'all' || selectedGender !== 'all' || generationFilter !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onBreedChange('all');
    onGenderChange('all');
    onGenerationFilterChange('all');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search goats by name or tag number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            
            <Select value={selectedBreed} onValueChange={onBreedChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                {breeds.map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGender} onValueChange={onGenderChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={generationFilter} onValueChange={onGenerationFilterChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Generation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Generations</SelectItem>
                <SelectItem value="foundation">Foundation (F0)</SelectItem>
                <SelectItem value="f1">First Gen (F1)</SelectItem>
                <SelectItem value="f2">Second Gen (F2)</SelectItem>
                <SelectItem value="f3">Third Gen (F3+)</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="bg-muted px-2 py-1 rounded">Search: "{searchTerm}"</span>
            )}
            {selectedBreed !== 'all' && (
              <span className="bg-muted px-2 py-1 rounded">Breed: {selectedBreed}</span>
            )}
            {selectedGender !== 'all' && (
              <span className="bg-muted px-2 py-1 rounded">Gender: {selectedGender}</span>
            )}
            {generationFilter !== 'all' && (
              <span className="bg-muted px-2 py-1 rounded">Generation: {generationFilter}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
