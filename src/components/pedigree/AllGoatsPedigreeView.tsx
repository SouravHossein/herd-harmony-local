import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, Grid, List, Search, TreePine } from 'lucide-react';
import { Goat } from '@/types/goat';
import { PedigreeSearchFilter } from './PedigreeSearchFilter';
import { PedigreeGoatCard } from './PedigreeGoatCard';

interface AllGoatsPedigreeViewProps {
  goats: Goat[];
  onViewGoat?: (goat: Goat) => void;
  onEditGoat?: (goat: Goat) => void;
  onViewPedigree?: (goat: Goat) => void;
  className?: string;
}

interface FilterCriteria {
  searchTerm: string;
  gender: 'all' | 'male' | 'female';
  status: 'all' | 'active' | 'sold' | 'deceased' | 'archived';
  breed: string;
  ageRange: [number, number];
  breedingStatus: string;
  hasParentInfo: 'all' | 'complete' | 'partial' | 'none';
}

export function AllGoatsPedigreeView({ 
  goats, 
  onViewGoat, 
  onEditGoat, 
  onViewPedigree,
  className = '' 
}: AllGoatsPedigreeViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    searchTerm: '',
    gender: 'all',
    status: 'all',
    breed: '',
    ageRange: [0, 120], // months
    breedingStatus: 'all',
    hasParentInfo: 'all'
  });

  

  const filteredGoats = useMemo(() => {
    return goats.filter(goat => {
      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          goat.name.toLowerCase().includes(searchLower) ||
          goat.tagNumber.toLowerCase().includes(searchLower) ||
          goat.breed.toLowerCase().includes(searchLower) ||
          (goat.nickname && goat.nickname.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Gender filter
      if (filters.gender !== 'all' && goat.gender !== filters.gender) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && goat.status !== filters.status) {
        return false;
      }

      // Breed filter
      if (filters.breed && goat.breed !== filters.breed) {
        return false;
      }

      // Age range filter
      const ageInMonths = Math.floor(
        (Date.now() - new Date(goat.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
      );
      if (ageInMonths < filters.ageRange[0] || ageInMonths > filters.ageRange[1]) {
        return false;
      }

      // Breeding status filter
      if (filters.breedingStatus !== 'all' && goat.breedingStatus !== filters.breedingStatus) {
        return false;
      }

      // Parent info filter
      if (filters.hasParentInfo !== 'all') {
        const hasMother = !!goat.motherId;
        const hasFather = !!goat.fatherId;
        
        switch (filters.hasParentInfo) {
          case 'complete':
            if (!hasMother || !hasFather) return false;
            break;
          case 'partial':
            if (!hasMother && !hasFather) return false;
            if (hasMother && hasFather) return false;
            break;
          case 'none':
            if (hasMother || hasFather) return false;
            break;
        }
      }

      return true;
    });
  }, [goats, filters]);

  const breeds = useMemo(() => {
    const uniqueBreeds = Array.from(new Set(goats.map(g => g.breed))).sort();
    return uniqueBreeds;
  }, [goats]);

  const breedingStatuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(goats.map(g => g.breedingStatus))).sort();
    return uniqueStatuses;
  }, [goats]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <TreePine className="h-6 w-6" />
            <span>Complete Herd Database</span>
          </h2>
          <p className="text-muted-foreground">
            View all goats and their relationships at once
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{filteredGoats.length}</p>
            <p className="text-sm text-muted-foreground">Total Goats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {filteredGoats.filter(g => g.gender === 'female').length}
            </p>
            <p className="text-sm text-muted-foreground">Females</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {filteredGoats.filter(g => g.gender === 'male').length}
            </p>
            <p className="text-sm text-muted-foreground">Males</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {filteredGoats.filter(g => g.motherId && g.fatherId).length}
            </p>
            <p className="text-sm text-muted-foreground">Complete Lineage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <PedigreeSearchFilter
          filters={filters}
          onFiltersChange={setFilters}
          breeds={breeds}
          breedingStatuses={breedingStatuses}
        />
      )}

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Herd Overview</span>
            </CardTitle>
            <Badge variant="secondary">
              {filteredGoats.length} of {goats.length} goats
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredGoats.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : 'space-y-4'
            }>
              {filteredGoats.map(goat => (
                <PedigreeGoatCard
                  key={goat.id}
                  goat={goat}
                  onView={onViewGoat}
                  onEdit={onEditGoat}
                  className={viewMode === 'list' ? 'w-full' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No goats found matching the current filters</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
