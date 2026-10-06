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
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            properties={mockProperties}
            onNavigate={setCurrentPage}
            onSelectProperty={handlePropertySelect}
          />
        );
      case 'search':
        return (
          <SearchPage
            initialQuery={searchQuery}
            properties={mockProperties}
            onSelectProperty={handlePropertySelect}
          />
        );
      case 'detail':
        return selectedProperty ? (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setCurrentPage('search')}
            onNavigate={setCurrentPage}
          />
        ) : (
          <HomePage
            properties={mockProperties}
            onNavigate={setCurrentPage}
            onSelectProperty={handlePropertySelect}
          />
        );
      case 'valuation':
        return <ValuationPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return (
          <DashboardPage
            onSelectProperty={handlePropertySelect}
          />
        );
      case 'pricing':
        return <PricingPage />;
      default:
        return (
          <HomePage
            properties={mockProperties}
            onNavigate={setCurrentPage}
            onSelectProperty={handlePropertySelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main>{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;