import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { GoatProvider } from '@/context/GoatContext';
import ElectronGuard from '@/components/ElectronGuard';

function App() {
  return (
    <ElectronGuard>
      <GoatProvider>
        <div className="min-h-screen bg-background">
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </GoatProvider>
    </ElectronGuard>
  );
}

export default App;
