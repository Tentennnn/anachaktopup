
import React from 'react';
import { motion } from 'framer-motion';
import { Rank } from '../types';

interface RankCardProps {
  rank: Rank;
  onBuy: (rank: Rank) => void;
  isStoreReady: boolean;
  isStoreConfigured: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const RankCard: React.FC<RankCardProps> = ({ rank, onBuy, isStoreReady, isStoreConfigured }) => {
  const isHighlighted = rank.highlighted;
  const buttonText = !isStoreReady ? 'LOADING...' : !isStoreConfigured ? 'UNAVAILABLE' : 'PURCHASE';
  const isButtonDisabled = !isStoreReady || !isStoreConfigured;
  const hasDiscount = rank.originalPrice && rank.originalPrice > rank.price;
  const discountPercentage = hasDiscount ? Math.round(((rank.originalPrice! - rank.price) / rank.originalPrice!) * 100) : 0;

  return (
    <motion.div
      {...{ variants: cardVariants }}
      className="relative h-full"
    >
      <motion.div
        {...{ whileHover: { scale: 1.02 } }}
        className={`
          p-1 rounded-xl h-full transition-all duration-300
          ${isHighlighted ? 'bg-gradient-to-br from-brand to-green-400' : 'bg-transparent hover:bg-gradient-to-br from-brand to-green-400'}
        `}
      >
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col text-center relative overflow-hidden">
          {isHighlighted && (
            <div className="absolute top-0 right-0 bg-brand text-black text-xs font-bold px-4 py-1.5 rounded-bl-lg z-10 font-pixel tracking-wider">
              {rank.bonus || 'BEST VALUE'}
            </div>
          )}
          {hasDiscount && (
             <div className="absolute top-2 left-2 bg-gradient-to-br from-red-500 to-orange-400 text-white text-xs font-bold w-12 h-12 flex items-center justify-center rounded-full z-10 font-pixel tracking-wider">
              - {discountPercentage}%
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-full p-4 self-center mb-4 border border-gray-700">
             <img src={rank.imageUrl} alt={`${rank.name} icon`} className="w-16 h-16" />
          </div>

          <h3 className="text-3xl font-pixel font-bold text-brand">{rank.name}</h3>
          <div className="mt-4 flex items-baseline justify-center gap-2">
            {hasDiscount && (
              <p className="text-2xl font-bold text-gray-500 line-through">${rank.originalPrice?.toFixed(2)}</p>
            )}
            <p className="text-4xl font-bold text-white">${rank.price.toFixed(2)}</p>
          </div>
          <p className="text-gray-400 text-sm mb-6">One-time Purchase</p>
          
          <ul className="mt-2 space-y-2.5 text-gray-300 flex-grow text-left">
            {rank.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-brand mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <motion.button
            onClick={() => onBuy(rank)}
            disabled={isButtonDisabled}
            {...{
              whileHover: { scale: isButtonDisabled ? 1 : 1.05 },
              whileTap: { scale: isButtonDisabled ? 1 : 0.95 },
            }}
            className={`mt-8 w-full font-bold font-pixel tracking-wider text-lg py-3 px-4 rounded-md transition-colors ${
              isButtonDisabled
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-brand text-black hover:bg-brand-dark'
            }`}
          >
            {buttonText}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RankCard;