
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GoatProvider } from './context/GoatContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ElectronGuard from './components/ElectronGuard';

function App() {
  return (
    <ElectronGuard>
      <ThemeProvider>
        <GoatProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </GoatProvider>
      </ThemeProvider>
    </ElectronGuard>
  );
}

export default App;
