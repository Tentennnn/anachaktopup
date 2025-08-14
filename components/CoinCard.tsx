import React from 'react';
import { motion } from 'framer-motion';
import { CoinPackage } from '../types';

interface CoinCardProps {
  coinPackage: CoinPackage;
  onBuy: (pkg: CoinPackage) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const CoinCard: React.FC<CoinCardProps> = ({ coinPackage, onBuy }) => {
  return (
    <motion.div 
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 flex flex-col text-center border border-gray-700 hover:border-brand transition-colors duration-300 relative w-full sm:w-72"
      variants={cardVariants}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(159, 232, 112, 0.15)",
        transition: { duration: 0.2 }
      }}
    >
      {coinPackage.bonus && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md z-10">
          {coinPackage.bonus}
        </div>
      )}
      <motion.div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-700 rounded-full p-2 border-4 border-gray-600"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <img src={coinPackage.imageUrl} alt="Coins icon" className="w-16 h-16" />
      </motion.div>
      <div className="pt-8">
        <h3 className="text-2xl font-pixel font-bold text-brand">{coinPackage.name}</h3>
        <p className="text-5xl font-bold text-white mt-4">{coinPackage.amount}</p>
        <p className="text-gray-400">In-game Coins</p>
      </div>
      <div className="flex-grow"></div>
      <p className="text-3xl font-bold text-white mt-6">${coinPackage.price.toFixed(2)}</p>
      <button
        onClick={() => onBuy(coinPackage)}
        className="mt-6 w-full bg-brand text-black font-bold py-3 px-4 rounded-md hover:bg-brand-dark transition-colors"
      >
        Buy Now
      </button>
    </motion.div>
  );
};

export default CoinCard;