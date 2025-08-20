
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RecentPurchase } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "just now";

  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years}y ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months}mo ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days}d ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours}h ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes}m ago`;
  }
  return `${Math.floor(seconds)}s ago`;
};


const RecentPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<RecentPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function loads purchases. It prioritizes a real API, 
    // then falls back to localStorage, then to demo data.
    const loadPurchases = async () => {
      setIsLoading(true);
      try {
        // 1. Attempt to fetch from a real backend API.
        // This will fail in the current environment but is ready for production.
        const response = await fetch('/api/recent-purchases');
        if (!response.ok) {
          throw new Error('API fetch failed, falling back to local storage.');
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        // 2. If API fails, try loading from the browser's local storage.
        const storedPurchases = localStorage.getItem('recentPurchases');
        if (storedPurchases) {
          setPurchases(JSON.parse(storedPurchases));
        } else {
          // 3. If local storage is empty, use initial demo data.
          const demoPurchases: RecentPurchase[] = [
            { _id: '1', username: 'Steve', item: 'Warrior Rank', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
            { _id: '2', username: 'Alex', item: '250 Coins', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
            { _id: '3', username: 'Herobrine', item: 'Legend Rank', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
          ];
          setPurchases(demoPurchases);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPurchases();

    // Listen for the custom event dispatched when a new purchase is made
    window.addEventListener('purchaseCompleted', loadPurchases);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('purchaseCompleted', loadPurchases);
    };
  }, []);

  const purchasesToShow = purchases.slice(0, 3);

  return (
    <div className="my-16 w-full max-w-4xl mx-auto">
      <h3 className="text-center text-lg font-pixel text-gray-400 mb-5 tracking-wider">Recent Activity</h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
           <div className="w-8 h-8 border-4 border-gray-500 border-t-brand rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          {...{
            variants: containerVariants,
            initial: "hidden",
            animate: "visible",
            exit: "hidden",
          }}
        >
          {purchasesToShow.length > 0 ? purchasesToShow.map((purchase) => (
            <motion.div
              key={purchase._id}
              {...{ variants: itemVariants }}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={`https://cravatar.eu/avatar/${purchase.username}/40.png`}
                  alt={`${purchase.username}'s avatar`}
                  className="w-10 h-10 rounded-md bg-gray-700"
                  width="40"
                  height="40"
                />
                <p className="text-md">
                  <span className="font-pixel text-white mr-2">{purchase.username}</span>
                  <span className="text-gray-300">purchased</span>
                  <strong className="font-bold text-brand ml-2">{purchase.item}</strong>
                </p>
              </div>
              <span className="text-sm text-gray-400 font-mono flex-shrink-0">{timeAgo(purchase.createdAt)}</span>
            </motion.div>
          )) : (
             <motion.div {...{ variants: itemVariants }} className="text-center text-gray-500 py-8">
                No recent activity to show.
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RecentPurchases;
