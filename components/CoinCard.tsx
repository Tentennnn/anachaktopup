
import React from 'react';
import { motion } from 'framer-motion';
import { CoinPackage } from '../types';

interface CoinCardProps {
  coinPackage: CoinPackage;
  onBuy: (pkg: CoinPackage) => void;
  isStoreReady: boolean;
  isStoreConfigured: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CoinCard: React.FC<CoinCardProps> = ({ coinPackage, onBuy, isStoreReady, isStoreConfigured }) => {
  const isHighlighted = coinPackage.highlighted;
  const buttonText = !isStoreReady ? 'LOADING...' : !isStoreConfigured ? 'UNAVAILABLE' : 'PURCHASE';
  const isButtonDisabled = !isStoreReady || !isStoreConfigured;
  const hasDiscount = coinPackage.originalPrice && coinPackage.originalPrice > coinPackage.price;
  const discountPercentage = hasDiscount ? Math.round(((coinPackage.originalPrice! - coinPackage.price) / coinPackage.originalPrice!) * 100) : 0;

  return (
    <motion.div
      {...{ variants: cardVariants }}
      className={`
        relative h-full
      `}
    >
        <motion.div
        {...{ whileHover: { scale: 1.02 } }}
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
          {hasDiscount && (
             <div className="absolute top-2 left-2 bg-gradient-to-br from-red-500 to-orange-400 text-white text-xs font-bold w-12 h-12 flex items-center justify-center rounded-full z-10 font-pixel tracking-wider">
              - {discountPercentage}%
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-full p-4 self-center mb-4 border border-gray-700">
             <img src={coinPackage.imageUrl} alt="Coins icon" className="w-16 h-16" />
          </div>

          <h3 className="text-3xl font-pixel font-bold text-yellow-400">{coinPackage.name}</h3>
          <p className="text-5xl font-bold text-white mt-4">{coinPackage.amount}</p>
          <p className="text-gray-400 mb-6">In-game Coins</p>
          
          <div className="flex-grow"></div>
          
          <div className="mt-6 flex items-baseline justify-center gap-2">
            {hasDiscount && (
                <p className="text-2xl font-bold text-gray-500 line-through">${coinPackage.originalPrice?.toFixed(2)}</p>
            )}
            <p className="text-4xl font-bold text-white">${coinPackage.price.toFixed(2)}</p>
          </div>

          <motion.button
            onClick={() => onBuy(coinPackage)}
            disabled={isButtonDisabled}
            {...{
              whileHover: { scale: isButtonDisabled ? 1 : 1.05 },
              whileTap: { scale: isButtonDisabled ? 1 : 0.95 },
            }}
            className={`mt-6 w-full font-bold font-pixel tracking-wider text-lg py-3 px-4 rounded-md transition-colors ${
              isButtonDisabled
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
          >
            {buttonText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CoinCard;