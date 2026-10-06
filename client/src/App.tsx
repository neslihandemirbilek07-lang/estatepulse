import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ValuationPage } from './pages/ValuationPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { mockProperties } from './data/mockData';
import { Property } from './types';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = (page: string, params?: any) => {
    if (page === 'search' && params?.query) {
      setSearchQuery(params.query);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'search' && (
          <SearchPage
            properties={mockProperties}
            initialQuery={searchQuery}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {currentPage === 'detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setCurrentPage('search')}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'valuation' && (
          <ValuationPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage onSelectProperty={handleSelectProperty} />
        )}

        {currentPage === 'pricing' && (
          <PricingPage />
        )}
      </main>

      {currentPage !== 'search' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
