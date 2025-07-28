
import React, { useState } from 'react';
import PedigreeTree from './PedigreeTree';
import { PedigreeSidebar } from './PedigreeSidebar';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';

interface PedigreeWrapperProps {
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeWrapper({ onShowHealth, onShowWeight }: PedigreeWrapperProps) {
  const { goats } = useGoatContext();
  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(
    goats.length > 0 ? goats[0] : null
  );

  const handleGoatSelect = (goat: Goat) => {
    setSelectedGoat(goat);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pedigree Tree</h2>
        <p className="text-muted-foreground">
          Explore lineage and genetic relationships in your herd
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        <div className="flex-1">
          <PedigreeTree
            goats={goats}
            selectedGoatId={selectedGoat?.id || ''}
            onGoatSelect={handleGoatSelect}
            onShowHealth={onShowHealth}
            onShowWeight={onShowWeight}
          />
        </div>
        <div className="flex-shrink-0">
          <PedigreeSidebar
            goat={selectedGoat}
            onShowHealth={onShowHealth}
            onShowWeight={onShowWeight}
          />
        </div>
      </div>
    </div>
  );
}
