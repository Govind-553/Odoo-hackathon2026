import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AppShell = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Navigation */}
      <Sidebar />
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-60 min-h-screen overflow-x-hidden transition-all">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppShell;
