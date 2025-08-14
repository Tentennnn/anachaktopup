import React from 'react';
import { motion } from 'framer-motion';
import { RANKS, COINS } from '../constants';
import { StoreItem } from '../types';
import RankCard from './RankCard';
import CoinCard from './CoinCard';
import TrophyIcon from './icons/TrophyIcon';
import CoinIcon from './icons/CoinIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

interface StoreProps {
  onBuyItem: (item: StoreItem) => void;
  onGoToHome: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1,
    }
  },
};

const Store: React.FC<StoreProps> = ({ onBuyItem, onGoToHome }) => {
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

      <motion.h1 
        className="text-4xl font-pixel font-bold text-center text-white mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Server Store
      </motion.h1>

      <motion.section 
        id="ranks"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="flex items-center justify-center md:justify-start gap-3 text-3xl font-pixel font-bold text-brand mb-8">
          <TrophyIcon />
          Ranks
        </h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-20">
          {RANKS.map((rank) => (
            <RankCard key={rank.name} rank={rank} onBuy={onBuyItem} />
          ))}
        </div>
      </motion.section>

      <motion.section 
        id="coins" 
        className="mt-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="flex items-center justify-center md:justify-start gap-3 text-3xl font-pixel font-bold text-brand mb-8">
          <CoinIcon />
          Coins
        </h2>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-20">
          {COINS.map((coinPkg) => (
            <CoinCard key={coinPkg.name} coinPackage={coinPkg} onBuy={onBuyItem} />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Store;