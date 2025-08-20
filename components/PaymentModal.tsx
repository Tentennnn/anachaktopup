
import React, { useState, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { StoreItem, RecentPurchase } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface PaymentModalProps {
  item: StoreItem;
  onClose: () => void;
  discordWebhookUrl?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.9, y: 50 },
};

const PaymentModal: React.FC<PaymentModalProps> = ({ item, onClose, discordWebhookUrl }) => {
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const [platform, setPlatform] = useState<'java' | 'bedrock'>('java');
  const [discordUsername, setDiscordUsername] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minecraftUsername.trim() || !paymentProof) {
      setErrorMessage('Minecraft Username and Payment Proof are required.');
      setStatus('error');
      return;
    }
    
    if (!discordWebhookUrl) {
      setErrorMessage('Store is not configured correctly. Please contact an admin.');
      setStatus('error');
      console.error("Discord Webhook URL is not configured. Check metadata.json.");
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData();
    const payload = {
      username: "ANACHAK Store Bot",
      avatar_url: "https://i.postimg.cc/fL4fSPVf/minecraft-title2.png",
      embeds: [{
        title: "New Purchase Submission",
        color: 0x9fe870,
        fields: [
          { name: "Item", value: `${item.name} - $${item.price.toFixed(2)}`, inline: false },
          { name: "Minecraft Username", value: minecraftUsername, inline: true },
          { name: "Platform", value: platform === 'java' ? 'Java' : 'Bedrock', inline: true },
          ...(discordUsername ? [{ name: "Discord Username", value: discordUsername, inline: false }] : []),
        ],
        image: { url: `attachment://${paymentProof.name}` },
        timestamp: new Date().toISOString(),
        footer: { text: "Please verify payment and grant items in-game." }
      }]
    };

    formData.append('payload_json', JSON.stringify(payload));
    formData.append('file1', paymentProof, paymentProof.name);

    try {
      const response = await fetch(discordWebhookUrl, { method: 'POST', body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Discord API Error:', errorText);
        throw new Error(`Failed to submit form. Discord API responded with ${response.status}.`);
      }
      setStatus('success');

      // --- SIMULATE DATABASE ENTRY ---
      // In a real app, your backend would save this to MongoDB.
      // Here, we save to localStorage to make the UI feel live.
      const purchaseData: Omit<RecentPurchase, '_id' | 'createdAt'> = {
        username: minecraftUsername,
        item: item.name,
      };

      const storedPurchases = localStorage.getItem('recentPurchases');
      let purchases: RecentPurchase[] = storedPurchases ? JSON.parse(storedPurchases) : [];
      
      const newPurchase: RecentPurchase = {
        ...purchaseData,
        _id: new Date().getTime().toString(), // Use timestamp for a simple unique ID
        createdAt: new Date().toISOString(),
      };

      purchases.unshift(newPurchase); // Add new purchase to the top
      purchases = purchases.slice(0, 10); // Keep the list to a max of 10 items
      
      localStorage.setItem('recentPurchases', JSON.stringify(purchases));
      
      // Notify other components (like RecentPurchases) that new data is available
      window.dispatchEvent(new Event('purchaseCompleted'));

    } catch (err: any) {
      setErrorMessage(err.message || 'An unknown error occurred. Please contact support.');
      setStatus('error');
    }
  };
  
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center p-8">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-white">Submitting your request...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-pixel font-bold text-brand mb-4">Success!</h2>
            <p className="text-gray-300 mb-6">Your purchase has been submitted. Our team will review it shortly. You can now close this window.</p>
            <button onClick={onClose} className="w-full bg-brand text-black font-bold py-3 px-4 rounded-md hover:bg-brand-dark transition-colors">
              Close
            </button>
          </div>
        );
      case 'error':
      case 'idle':
      default:
        return (
          <>
            <h2 className="text-2xl font-pixel font-bold text-center text-white mb-1">Purchase Application</h2>
            <p className="text-center text-gray-400 mb-6">Complete the form for: <span className="font-bold text-brand">{item.name}</span></p>
            {status === 'error' && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="minecraftUsername" className="block text-sm font-medium text-gray-300 mb-1">Minecraft Username <span className="text-red-500">*</span></label>
                <input type="text" id="minecraftUsername" value={minecraftUsername} onChange={e => setMinecraftUsername(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Platform <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 p-2 border border-gray-700 rounded-md flex-1 cursor-pointer hover:bg-gray-700 has-[:checked]:border-brand has-[:checked]:bg-brand/10">
                    <input type="radio" name="platform" value="java" checked={platform === 'java'} onChange={() => setPlatform('java')} className="accent-brand w-4 h-4" />
                    Java Edition
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-gray-700 rounded-md flex-1 cursor-pointer hover:bg-gray-700 has-[:checked]:border-brand has-[:checked]:bg-brand/10">
                    <input type="radio" name="platform" value="bedrock" checked={platform === 'bedrock'} onChange={() => setPlatform('bedrock')} className="accent-brand w-4 h-4" />
                    Bedrock Edition
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="discordUsername" className="block text-sm font-medium text-gray-300 mb-1">Discord Username (Optional)</label>
                <input type="text" id="discordUsername" value={discordUsername} onChange={e => setDiscordUsername(e.target.value)} placeholder="yourname#1234" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Payment Proof Screenshot <span className="text-red-500">*</span></label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" required />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full text-center bg-gray-700 border border-gray-600 rounded-md px-3 py-2 hover:bg-gray-600">
                  {paymentProof ? `Selected: ${paymentProof.name}` : 'Upload Image'}
                </button>
              </div>
              <button type="submit" className="w-full bg-brand text-black font-bold py-3 px-4 rounded-md hover:bg-brand-dark transition-colors">
                Submit Application
              </button>
            </form>
          </>
        );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={() => status !== 'loading' && onClose()}
    >
      <motion.div
        className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-md w-full relative border border-brand/50"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {status !== 'loading' && (
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white" aria-label="Close">
            <XMarkIcon />
          </button>
        )}
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
