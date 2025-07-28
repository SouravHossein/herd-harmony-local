
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { PedigreeTree } from './PedigreeTree';

interface PedigreeWrapperProps {
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeWrapper({ onShowHealth, onShowWeight }: PedigreeWrapperProps) {
  return (
    <ReactFlowProvider>
      <PedigreeTree onShowHealth={onShowHealth} onShowWeight={onShowWeight} />
    </ReactFlowProvider>
  );
}
