import React from 'react';
import { motion } from 'framer-motion';
import { Rank } from '../types';

interface RankCardProps {
  rank: Rank;
  onBuy: (rank: Rank) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const RankCard: React.FC<RankCardProps> = ({ rank, onBuy }) => {
  return (
    <motion.div 
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 flex flex-col border border-gray-700 hover:border-brand transition-colors duration-300 relative text-center w-full sm:w-72"
      variants={cardVariants}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(159, 232, 112, 0.15)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-700 rounded-full p-2 border-4 border-gray-600"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={rank.imageUrl} alt={`${rank.name} icon`} className="w-16 h-16" />
      </motion.div>
      <div className="pt-8">
        <h3 className="text-2xl font-pixel font-bold text-brand">{rank.name}</h3>
        <p className="text-4xl font-bold text-white mt-4">${rank.price.toFixed(2)}</p>
        <p className="text-gray-400 text-sm mb-4">One-time Purchase</p>
      </div>
      <ul className="mt-2 space-y-2 text-gray-300 flex-grow text-left">
        {rank.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-brand mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onBuy(rank)}
        className="mt-8 w-full bg-brand text-black font-bold py-3 px-4 rounded-md hover:bg-brand-dark transition-colors"
      >
        Buy Now
      </button>
    </motion.div>
  );
};

export default RankCard;