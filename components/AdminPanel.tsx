
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import ItemEditModal from './ItemEditModal';
import { StoreItem, Rank, CoinPackage } from '../types';

interface AdminPanelProps {
  isStoreDisabled: boolean;
  onToggleStoreDisabled: () => void;
  onGoToHome: () => void;
  ranks: Rank[];
  setRanks: React.Dispatch<React.SetStateAction<Rank[]>>;
  coins: CoinPackage[];
  setCoins: React.Dispatch<React.SetStateAction<CoinPackage[]>>;
  serverName: string;
  setServerName: React.Dispatch<React.SetStateAction<string>>;
  serverIP: string;
  setServerIP: React.Dispatch<React.SetStateAction<string>>;
  serverDescription: string;
  setServerDescription: React.Dispatch<React.SetStateAction<string>>;
  themeColor: string;
  setThemeColor: React.Dispatch<React.SetStateAction<string>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isStoreDisabled, 
  onToggleStoreDisabled, 
  onGoToHome,
  ranks,
  setRanks,
  coins,
  setCoins,
  serverName,
  setServerName,
  serverIP,
  setServerIP,
  serverDescription,
  setServerDescription,
  themeColor,
  setThemeColor,
}) => {
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<'Rank' | 'Coin' | null>(null);
  
  // Local state for general settings form
  const [localServerName, setLocalServerName] = useState(serverName);
  const [localServerIP, setLocalServerIP] = useState(serverIP);
  const [localServerDescription, setLocalServerDescription] = useState(serverDescription);
  const [localThemeColor, setLocalThemeColor] = useState(themeColor);
  const [isSaved, setIsSaved] = useState(false);

  const hasUnsavedChanges = localServerName !== serverName || localServerIP !== serverIP || localThemeColor !== themeColor || localServerDescription !== serverDescription;

  const handleSaveSettings = () => {
    setServerName(localServerName);
    setServerIP(localServerIP);
    setServerDescription(localServerDescription);
    setThemeColor(localThemeColor);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };
  
  const handleResetSettings = () => {
    setLocalServerName(serverName);
    setLocalServerIP(serverIP);
    setLocalServerDescription(serverDescription);
    setLocalThemeColor(themeColor);
  };


  const handleOpenModal = (item: StoreItem) => {
    setEditingItem(item);
    setIsCreatingNew(null);
  };
  
  const handleOpenCreateModal = (type: 'Rank' | 'Coin') => {
    setIsCreatingNew(type);
    setEditingItem(null);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsCreatingNew(null);
  };

  const handleSaveItem = (itemToSave: StoreItem, isNew: boolean) => {
    if (itemToSave.type === 'Rank') {
      setRanks(prevRanks => {
        if (isNew) {
          if (prevRanks.some(r => r.name.toLowerCase() === itemToSave.name.toLowerCase())) {
            alert(`A rank with the name "${itemToSave.name}" already exists.`);
            return prevRanks;
          }
          return [...prevRanks, itemToSave as Rank];
        } else {
          const index = prevRanks.findIndex(r => r.name === itemToSave.name);
          if (index === -1) return prevRanks; // Should not happen
          const newRanks = [...prevRanks];
          newRanks[index] = itemToSave as Rank;
          return newRanks;
        }
      });
    } else if (itemToSave.type === 'Coin') {
      setCoins(prevCoins => {
        if (isNew) {
          if (prevCoins.some(c => c.name.toLowerCase() === itemToSave.name.toLowerCase())) {
            alert(`A coin package with the name "${itemToSave.name}" already exists.`);
            return prevCoins;
          }
          return [...prevCoins, itemToSave as CoinPackage];
        } else {
          const index = prevCoins.findIndex(c => c.name === itemToSave.name);
          if (index === -1) return prevCoins;
          const newCoins = [...prevCoins];
          newCoins[index] = itemToSave as CoinPackage;
          return newCoins;
        }
      });
    }
    handleCloseModal();
  };

  const handleDeleteItem = (itemToDelete: StoreItem) => {
    if (window.confirm(`Are you sure you want to delete "${itemToDelete.name}"? This cannot be undone.`)) {
      if (itemToDelete.type === 'Rank') {
        setRanks(prevRanks => prevRanks.filter(r => r.name !== itemToDelete.name));
      } else {
        setCoins(prevCoins => prevCoins.filter(c => c.name !== itemToDelete.name));
      }
    }
  };

  const itemToEditOrCreate = editingItem ?? (isCreatingNew === 'Rank' 
    ? { type: 'Rank', name: '', price: 0, features: [], imageUrl: '' } as Rank
    : isCreatingNew === 'Coin'
    ? { type: 'Coin', name: '', amount: 0, price: 0, imageUrl: '' } as CoinPackage
    : null);

  return (
    <div>
        <div className="mb-8">
            <button
            onClick={onGoToHome}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
            <ChevronLeftIcon />
            Back to Home
            </button>
        </div>
        <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-pixel font-bold text-white tracking-wider">
                Admin Controls
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Manage server store settings from here.
            </p>
        </div>

        <motion.div
            className="w-full max-w-4xl mx-auto space-y-12"
            {...{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
            }}
        >
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
            <h2 className="text-2xl font-pixel text-brand mb-6">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="serverName" className="block text-sm font-medium text-gray-300 mb-1">Server Name</label>
                <input type="text" id="serverName" value={localServerName} onChange={e => setLocalServerName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
              </div>
              <div>
                <label htmlFor="serverIP" className="block text-sm font-medium text-gray-300 mb-1">Server IP</label>
                <input type="text" id="serverIP" value={localServerIP} onChange={e => setLocalServerIP(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
              </div>
               <div>
                <label htmlFor="serverDescription" className="block text-sm font-medium text-gray-300 mb-1">Server Description</label>
                <textarea id="serverDescription" rows={3} value={localServerDescription} onChange={e => setLocalServerDescription(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
              </div>
              <div>
                <label htmlFor="themeColor" className="block text-sm font-medium text-gray-300 mb-1">Brand Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" id="themeColor" value={localThemeColor} onChange={e => setLocalThemeColor(e.target.value)} className="h-10 w-10 p-1 bg-gray-900 border border-gray-700 rounded-md cursor-pointer" />
                  <input type="text" value={localThemeColor} onChange={e => setLocalThemeColor(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand font-mono" />
                </div>
              </div>
            </div>
             <div className="flex items-center justify-end gap-4 mt-6">
                <AnimatePresence>
                    {hasUnsavedChanges && (
                        <motion.button 
                            onClick={handleResetSettings} 
                            className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            Discard Changes
                        </motion.button>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleSaveSettings}
                    disabled={!hasUnsavedChanges || isSaved}
                    className="bg-brand text-black font-bold px-5 py-2 rounded-md hover:bg-brand-dark transition-all text-sm disabled:bg-gray-600 disabled:cursor-not-allowed min-w-[120px]"
                >
                    {isSaved ? 'Saved!' : 'Save Settings'}
                </button>
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
            <h2 className="text-2xl font-pixel text-brand mb-6">Store Settings</h2>
            <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-md border border-gray-700">
                <div>
                    <h3 className="font-bold text-white text-lg">Store Availability</h3>
                    <p className="text-gray-400 text-sm">Turn this off to display the 'Store Temporarily Unavailable' banner.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-bold text-sm ${isStoreDisabled ? 'text-red-400' : 'text-green-400'}`}>
                        {isStoreDisabled ? 'DISABLED' : 'ENABLED'}
                    </span>
                    <button
                        onClick={onToggleStoreDisabled}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isStoreDisabled ? 'bg-gray-600' : 'bg-brand'}`}
                        aria-pressed={!isStoreDisabled}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isStoreDisabled ? 'translate-x-1' : 'translate-x-6'}`}
                        />
                    </button>
                </div>
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-pixel text-brand">Manage Ranks</h2>
              <button onClick={() => handleOpenCreateModal('Rank')} className="bg-brand text-black font-bold px-4 py-2 rounded-md hover:bg-brand-dark transition-colors text-sm">Add New Rank</button>
            </div>
            <div className="space-y-3">
              {ranks.map(rank => (
                <div key={rank.name} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md border border-gray-700">
                  <span className="font-bold text-white">{rank.name}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenModal(rank)} className="text-gray-400 hover:text-white"><PencilIcon/></button>
                    <button onClick={() => handleDeleteItem(rank)} className="text-gray-400 hover:text-red-500"><TrashIcon/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-pixel text-brand">Manage Coins</h2>
              <button onClick={() => handleOpenCreateModal('Coin')} className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors text-sm">Add New Coin Package</button>
            </div>
            <div className="space-y-3">
              {coins.map(coin => (
                <div key={coin.name} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md border border-gray-700">
                  <span className="font-bold text-white">{coin.name}</span>
                   <div className="flex items-center gap-3">
                    <button onClick={() => handleOpenModal(coin)} className="text-gray-400 hover:text-white"><PencilIcon/></button>
                    <button onClick={() => handleDeleteItem(coin)} className="text-gray-400 hover:text-red-500"><TrashIcon/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {itemToEditOrCreate && (
            <ItemEditModal 
              item={itemToEditOrCreate}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              isNew={!!isCreatingNew}
            />
          )}
        </AnimatePresence>
    </div>
  );
};

export default AdminPanel;