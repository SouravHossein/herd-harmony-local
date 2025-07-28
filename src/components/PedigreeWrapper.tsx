
import React, { useState } from 'react';
import { PedigreeTree } from './PedigreeTree';
import { PedigreeSidebar } from './PedigreeSidebar';
import { useGoatData } from '@/hooks/useDatabase';

interface PedigreeWrapperProps {
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeWrapper({ onShowHealth, onShowWeight }: PedigreeWrapperProps) {
  const [selectedGoatId, setSelectedGoatId] = useState<string | undefined>();
  const { goats } = useGoatData();

  const handleGoatSelect = (goatId: string) => {
    setSelectedGoatId(goatId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Pedigree Tree</h1>
        <div className="text-sm text-gray-500">
          {goats.length} goats in database
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PedigreeTree
            selectedGoatId={selectedGoatId}
            onGoatSelect={handleGoatSelect}
            onShowHealth={onShowHealth}
            onShowWeight={onShowWeight}
          />
        </div>

        <div className="lg:col-span-1">
          <PedigreeSidebar
            selectedGoatId={selectedGoatId}
            onShowHealth={onShowHealth}
            onShowWeight={onShowWeight}
          />
        </div>
      </div>
    </div>
  );
}
