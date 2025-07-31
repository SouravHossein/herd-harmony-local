
import React from 'react';
import Layout from '@/components/Layout';
import { GoatProvider } from '@/context/GoatContext';
import Dashboard from '@/components/Dashboard';

export default function Index() {
  return (
    <GoatProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </GoatProvider>
  );
}
