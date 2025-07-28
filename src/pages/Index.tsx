
import React, { useState, useEffect } from 'react';
import { GoatProvider } from '@/context/GoatContext';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { GoatManagement } from '@/components/GoatManagement';
import { DataManagement } from '@/components/DataManagement';
import { WeightTracking } from '@/components/WeightTracking';
import { HealthRecords } from '@/components/HealthRecords';
import { HealthDashboard } from '@/components/HealthDashboard';
import { PedigreeWrapper } from '@/components/PedigreeWrapper';
import { loadSampleData } from '@/data/sampleData';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Load sample data on first visit
    loadSampleData();
  }, []);

  const handleShowHealth = (goatId: string) => {
    setCurrentPage('health');
    // Here you could pass the goatId to filter health records
  };

  const handleShowWeight = (goatId: string) => {
    setCurrentPage('weight');
    // Here you could pass the goatId to filter weight records
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'goats':
        return <GoatManagement />;
      case 'weight':
        return <WeightTracking />;
      case 'health':
        return <HealthRecords />;
      case 'health-ai':
        return <HealthDashboard />;
      case 'pedigree':
        return <PedigreeWrapper onShowHealth={handleShowHealth} onShowWeight={handleShowWeight} />;
      case 'export':
      case 'import':
      case 'settings':
        return <DataManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <GoatProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </GoatProvider>
  );
};

export default Index;
