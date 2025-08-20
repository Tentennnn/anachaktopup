
import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { StoreItem, Rank, CoinPackage } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface ItemEditModalProps {
  item: StoreItem;
  onClose: () => void;
  onSave: (item: StoreItem, isNew: boolean) => void;
  isNew: boolean;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.9, y: 50 },
};

const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, onClose, onSave, isNew }) => {
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numValue = value === '' ? '' : parseFloat(value);
      if (numValue === '' || !isNaN(numValue)) {
        setFormData(prev => ({ ...prev, [name]: numValue === '' ? undefined : numValue }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };
    if ('features' in finalData && typeof finalData.features === 'string') {
      finalData.features = (finalData.features as string).split('\n').filter(f => f.trim() !== '');
    }
    // Clean up empty optional fields
    if ('originalPrice' in finalData && !finalData.originalPrice) {
        delete finalData.originalPrice;
    }
    if ('bonus' in finalData && finalData.bonus === '') {
        delete finalData.bonus;
    }
    onSave(finalData, isNew);
  };
  
  const isRank = formData.type === 'Rank';

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-lg w-full relative border border-brand/50 max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white" aria-label="Close">
            <XMarkIcon />
        </button>
        <h2 className="text-2xl font-pixel font-bold text-center text-white mb-6">{isNew ? 'Create' : 'Edit'} {formData.type}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isNew} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand disabled:opacity-50" required />
            </div>
            
            {isRank && 'features' in formData && (
                 <div>
                    <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-1">Features (one per line)</label>
                    <textarea name="features" rows={4} value={Array.isArray(formData.features) ? formData.features.join('\n') : formData.features} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
                </div>
            )}

            {!isRank && 'amount' in formData && (
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleNumberChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" required />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
                  <input type="number" name="price" step="0.01" value={formData.price} onChange={handleNumberChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" required />
              </div>
              <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-300 mb-1">Original Price (for discount)</label>
                  <input type="number" name="originalPrice" step="0.01" value={formData.originalPrice ?? ''} onChange={handleNumberChange} placeholder="Optional" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
              </div>
            </div>

            {'bonus' in formData && (
                <div>
                    <label htmlFor="bonus" className="block text-sm font-medium text-gray-300 mb-1">Bonus Text</label>
                    <input type="text" name="bonus" value={formData.bonus ?? ''} onChange={handleChange} placeholder="e.g., 'Best Value' or 'Save 5%'" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
                </div>
            )}
             
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" required />
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" name="highlighted" id="highlighted" checked={!!formData.highlighted} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand accent-brand" />
                <label htmlFor="highlighted" className="text-sm text-gray-300">Highlight this item? (shows promo tag)</label>
            </div>

            <button type="submit" className="w-full bg-brand text-black font-bold py-3 px-4 rounded-md hover:bg-brand-dark transition-colors mt-4">
                Save Changes
            </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ItemEditModal;