
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { GoatManagement } from '@/components/GoatManagement';
import { WeightTracking } from '@/components/WeightTracking';
import { HealthDashboard } from '@/components/HealthDashboard';
import { PedigreeWrapper } from '@/components/PedigreeWrapper';
import { DataManagement } from '@/components/DataManagement';
import { BackupManager } from '@/components/BackupManager';
import { FeedDashboard } from '@/components/feed/FeedDashboard';
import FinanceDashboard from '@/components/finance/FinanceDashboard';
import { HealthAI } from '@/components/HealthAI';
import GrowthOptimizer from '@/components/GrowthOptimizer';
import BreedingPlanner from '@/components/breeding/BreedingPlanner';
import { WeatherDashboard } from '@/components/weather/WeatherDashboard';
import { GoatProvider } from '@/context/GoatContext';

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleShowHealth = (goatId: string) => {
    setActiveSection('health');
  };

  const handleShowWeight = (goatId: string) => {
    setActiveSection('weight');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'goats':
        return <GoatManagement />;
      case 'weight':
        return <WeightTracking />;
      case 'health':
        return <HealthDashboard />;
      case 'breeding':
        return <BreedingPlanner />;
      case 'pedigree':
        return <PedigreeWrapper onShowHealth={handleShowHealth} onShowWeight={handleShowWeight} />;
      case 'finance':
        return <FinanceDashboard />;
      case 'feed':
        return <FeedDashboard />;
      case 'weather':
        return <WeatherDashboard />;
      case 'health-ai':
        return <HealthAI />;
      case 'growth-optimizer':
        return <GrowthOptimizer />;
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
      <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </Layout>
    </GoatProvider>
  );
}
