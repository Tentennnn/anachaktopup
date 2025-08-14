import React from 'react';
import { motion } from 'framer-motion';
import { CoinPackage } from '../types';

interface CoinCardProps {
  coinPackage: CoinPackage;
  onBuy: (pkg: CoinPackage) => void;
  isStoreReady: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CoinCard: React.FC<CoinCardProps> = ({ coinPackage, onBuy, isStoreReady }) => {
  const isHighlighted = coinPackage.highlighted;

  return (
    <motion.div
      variants={cardVariants}
      className={`
        relative h-full
      `}
    >
        <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          p-1 rounded-xl h-full transition-all duration-300
          ${isHighlighted ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 'bg-transparent hover:bg-gradient-to-br from-yellow-400 to-amber-500'}
        `}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col text-center relative overflow-hidden">
          {coinPackage.bonus && (
            <div className={`absolute top-0 right-0 text-black text-xs font-bold px-4 py-1.5 rounded-bl-lg z-10 font-pixel tracking-wider ${isHighlighted ? 'bg-yellow-300' : 'bg-yellow-400'}`}>
              {coinPackage.bonus}
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-full p-4 self-center mb-4 border border-gray-700">
             <img src={coinPackage.imageUrl} alt="Coins icon" className="w-16 h-16" />
          </div>

          <h3 className="text-3xl font-pixel font-bold text-yellow-400">{coinPackage.name}</h3>
          <p className="text-5xl font-bold text-white mt-4">{coinPackage.amount}</p>
          <p className="text-gray-400 mb-6">In-game Coins</p>
          
          <div className="flex-grow"></div>
          
          <p className="text-4xl font-bold text-white mt-6">${coinPackage.price.toFixed(2)}</p>

          <motion.button
            onClick={() => onBuy(coinPackage)}
            disabled={!isStoreReady}
            whileHover={{ scale: isStoreReady ? 1.05 : 1 }}
            whileTap={{ scale: isStoreReady ? 0.95 : 1 }}
            className={`mt-6 w-full bg-yellow-400 text-black font-bold font-pixel tracking-wider text-lg py-3 px-4 rounded-md transition-colors ${isStoreReady ? 'hover:bg-yellow-500' : 'opacity-50 cursor-not-allowed'}`}
          >
            {isStoreReady ? 'PURCHASE' : 'LOADING...'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoinCard;