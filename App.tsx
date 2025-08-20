
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Store from './components/Store';
import PaymentModal from './components/PaymentModal';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { StoreItem, Rank, CoinPackage } from './types';
import { config } from './config';
import { INITIAL_RANKS, INITIAL_COINS } from './constants';
import ThemeManager from './components/ThemeManager';

type Page = 'home' | 'store' | 'admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // General site settings
  const [serverName, setServerName] = useState(() => localStorage.getItem('serverName') || 'ANACHAK-MC');
  const [serverIP, setServerIP] = useState(() => localStorage.getItem('serverIP') || 'mc.anachak.xyz');
  const [serverDescription, setServerDescription] = useState(() => localStorage.getItem('serverDescription') || 'Your new favorite Minecraft server. Join our community for unique survival adventures and challenges.');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || '#9fe870');

  const [ranks, setRanks] = useState<Rank[]>(() => {
    try {
      const storedRanks = localStorage.getItem('storeRanks');
      return storedRanks ? JSON.parse(storedRanks) : INITIAL_RANKS;
    } catch {
      return INITIAL_RANKS;
    }
  });

  const [coins, setCoins] = useState<CoinPackage[]>(() => {
    try {
      const storedCoins = localStorage.getItem('storeCoins');
      return storedCoins ? JSON.parse(storedCoins) : INITIAL_COINS;
    } catch {
      return INITIAL_COINS;
    }
  });

  const [isStoreDisabledByAdmin, setIsStoreDisabledByAdmin] = useState(() => {
    try {
      const storedValue = localStorage.getItem('storeDisabledByAdmin');
      return storedValue ? JSON.parse(storedValue) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('serverName', serverName);
    document.title = `${serverName} | Minecraft Server`;
  }, [serverName]);

  useEffect(() => {
    localStorage.setItem('serverIP', serverIP);
  }, [serverIP]);
  
  useEffect(() => {
    localStorage.setItem('serverDescription', serverDescription);
  }, [serverDescription]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('storeDisabledByAdmin', JSON.stringify(isStoreDisabledByAdmin));
  }, [isStoreDisabledByAdmin]);

  useEffect(() => {
    localStorage.setItem('storeRanks', JSON.stringify(ranks));
  }, [ranks]);

  useEffect(() => {
    localStorage.setItem('storeCoins', JSON.stringify(coins));
  }, [coins]);


  const handleBuyItem = (item: StoreItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  
  const isStoreConfigured = !!config.discordWebhookUrl && !isStoreDisabledByAdmin;

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onGoToStore={() => setCurrentPage('store')} serverName={serverName} serverIP={serverIP} serverDescription={serverDescription} />;
      case 'store':
        return <Store ranks={ranks} coins={coins} onBuyItem={handleBuyItem} onGoToHome={() => setCurrentPage('home')} isStoreReady={true} isStoreConfigured={isStoreConfigured} />;
      case 'admin':
        if (!isAdminAuthenticated) {
          return <AdminLogin adminPassword={config.adminPassword} onLoginSuccess={() => setIsAdminAuthenticated(true)} />;
        }
        return <AdminPanel 
                  isStoreDisabled={isStoreDisabledByAdmin} 
                  onToggleStoreDisabled={() => setIsStoreDisabledByAdmin(prev => !prev)} 
                  onGoToHome={() => setCurrentPage('home')}
                  ranks={ranks}
                  setRanks={setRanks}
                  coins={coins}
                  setCoins={setCoins}
                  serverName={serverName}
                  setServerName={setServerName}
                  serverIP={serverIP}
                  setServerIP={setServerIP}
                  serverDescription={serverDescription}
                  setServerDescription={setServerDescription}
                  themeColor={themeColor}
                  setThemeColor={setThemeColor}
                />;
      default:
        return <Hero onGoToStore={() => setCurrentPage('store')} serverName={serverName} serverIP={serverIP} serverDescription={serverDescription} />;
    }
  }

  return (
    <div className="text-white min-h-screen flex flex-col">
      <ThemeManager color={themeColor} />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} serverName={serverName} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            {...{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              transition: { duration: 0.3 },
            }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer serverName={serverName} />
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