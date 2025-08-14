import React from 'react';
import { motion } from 'framer-motion';
import { RANKS, COINS } from '../constants';
import { StoreItem } from '../types';
import RankCard from './RankCard';
import CoinCard from './CoinCard';
import TrophyIcon from './icons/TrophyIcon';
import CoinIcon from './icons/CoinIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import RecentPurchases from './RecentPurchases';

interface StoreProps {
  onBuyItem: (item: StoreItem) => void;
  onGoToHome: () => void;
  isStoreReady: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1,
    }
  },
};

const Store: React.FC<StoreProps> = ({ onBuyItem, onGoToHome, isStoreReady }) => {
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

      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl sm:text-6xl font-pixel font-bold text-white tracking-wider">
          Server Store
        </h1>
        <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
          Unlock exclusive perks and get ahead in the game. All purchases directly support the server's development and maintenance.
        </p>
      </motion.div>

      <RecentPurchases />

      <motion.section 
        id="ranks"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="mb-24"
      >
        <h2 className="flex items-center justify-center gap-3 text-3xl font-pixel font-bold text-brand mb-10">
          <TrophyIcon />
          Player Ranks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {RANKS.map((rank) => (
            <RankCard key={rank.name} rank={rank} onBuy={onBuyItem} isStoreReady={isStoreReady} />
          ))}
        </div>
      </motion.section>

      <motion.section 
        id="coins" 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="flex items-center justify-center gap-3 text-3xl font-pixel font-bold text-brand mb-10">
          <CoinIcon />
          Coin Packages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {COINS.map((coinPkg) => (
            <CoinCard key={coinPkg.name} coinPackage={coinPkg} onBuy={onBuyItem} isStoreReady={isStoreReady} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Store;