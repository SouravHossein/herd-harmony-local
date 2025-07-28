import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Goat } from '@/types/goat';

interface ParentSelectorProps {
  goats: Goat[];
  selectedFatherId?: string;
  selectedMotherId?: string;
  onFatherChange: (fatherId?: string) => void;
  onMotherChange: (motherId?: string) => void;
  excludeGoatId?: string;
}

export default function ParentSelector({
  goats,
  selectedFatherId,
  selectedMotherId,
  onFatherChange,
  onMotherChange,
  excludeGoatId
}: ParentSelectorProps) {
  const maleGoats = goats.filter(g => 
    g.gender === 'male' && 
    g.status === 'active' && 
    g.id !== excludeGoatId
  );
  
  const femaleGoats = goats.filter(g => 
    g.gender === 'female' && 
    g.status === 'active' && 
    g.id !== excludeGoatId
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="father">Father (Sire)</Label>
        <Select
          value={selectedFatherId || "unknown"}
          onValueChange={(value) => onFatherChange(value === "unknown" ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select father" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unknown">Unknown Sire</SelectItem>
            {maleGoats.map(goat => (
              <SelectItem key={goat.id} value={goat.id}>
                {goat.name} ({goat.tagNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mother">Mother (Dam)</Label>
        <Select
          value={selectedMotherId || "unknown"}
          onValueChange={(value) => onMotherChange(value === "unknown" ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mother" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unknown">Unknown Dam</SelectItem>
            {femaleGoats.map(goat => (
              <SelectItem key={goat.id} value={goat.id}>
                {goat.name} ({goat.tagNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}