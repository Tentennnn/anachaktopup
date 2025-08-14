import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Store from './components/Store';
import PaymentModal from './components/PaymentModal';
import { StoreItem } from './types';

type Page = 'home' | 'store';

interface AppConfig {
  discordWebhookUrl?: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [config, setConfig] = useState<AppConfig>({});

  useEffect(() => {
    fetch('/metadata.json')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error("Error fetching configuration:", error));
  }, []);


  const handleBuyItem = (item: StoreItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="text-white min-h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <Hero onGoToStore={() => setCurrentPage('store')} />}
            {currentPage === 'store' && <Store onBuyItem={handleBuyItem} onGoToHome={() => setCurrentPage('home')} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <AnimatePresence>
        {selectedItem && (
          <PaymentModal 
            item={selectedItem} 
            onClose={handleCloseModal} 
            discordWebhookUrl={config.discordWebhookUrl}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;