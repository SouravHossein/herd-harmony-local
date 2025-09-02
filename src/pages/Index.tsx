
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import AllInOneDashboard from '@/components/dashboard/AllInOneDashboard';
import { FeedDashboard } from '@/components/feed/FeedDashboard';
import FinanceDashboard from '@/components/finance/FinanceDashboard';
import { HealthAI } from '@/components/HealthAI';
import GrowthOptimizer from '@/components/GrowthOptimizer';
import BreedingPlanner from '@/components/breeding/BreedingPlanner';
import { WeatherDashboard } from '@/components/weather/WeatherDashboard';
import Settings from '@/components/Settings';
import { WeightTracking } from '@/components/weight/WeightTracking';
import GoatManagement from '@/components/goats/GoatManagement';

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AllInOneDashboard />;
      case 'goats':
        return <GoatManagement />;
      case 'weight':
        return <WeightTracking />;
      case 'pedigree':
        return 
      case 'breeding':
        return <BreedingPlanner />;
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
      case 'settings':
        return <Settings />;
      default:
        return <AllInOneDashboard />;
    }
  };

  return (
    <Layout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </Layout>
  );
}
