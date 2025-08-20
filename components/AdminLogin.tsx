
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AdminLoginProps {
  adminPassword?: string;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ adminPassword, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPassword) {
      setError('Admin password is not set in configuration. Please contact an administrator.');
      return;
    }

    if (password === adminPassword) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8"
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
        }}
      >
        <h1 className="text-3xl font-pixel font-bold text-white text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-brand focus:border-brand"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-md">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-brand text-black font-bold font-pixel tracking-wider text-lg py-3 px-4 rounded-md transition-colors hover:bg-brand-dark disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={!password}
            >
              Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
