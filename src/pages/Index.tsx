import React, { useState } from 'react';
import { GoatProvider } from '@/context/GoatContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { GoatManagement } from '@/components/GoatManagement';
import { WeightTracking } from '@/components/WeightTracking';
import { HealthAI } from '@/components/HealthAI';
import { PedigreeWrapper } from '@/components/PedigreeWrapper';
import { FeedDashboard } from '@/components/feed/FeedDashboard';
import { FinanceDashboard } from '@/components/finance/FinanceDashboard';
import { DataManagement } from '@/components/DataManagement';
import { BackupManager } from '@/components/BackupManager';
import { GrowthOptimizer } from '@/components/GrowthOptimizer';

function Index() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'goats':
        return <GoatManagement />;
      case 'weight':
        return <WeightTracking />;
      case 'growth':
        return <GrowthOptimizer />;
      case 'health':
        return <HealthAI />;
      case 'pedigree':
        return <PedigreeWrapper />;
      case 'feed':
        return <FeedDashboard />;
      case 'finance':
        return <FinanceDashboard />;
      case 'data':
        return <DataManagement />;
      case 'backup':
        return <BackupManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <GoatProvider>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderContent()}
      </Layout>
    </GoatProvider>
  );
}

export default Index;
