import { Rank, CoinPackage } from './types';

export const INITIAL_RANKS: Rank[] = [
  { type: 'Rank', name: 'Explorer', price: 5, features: ['Special Chat Prefix', '1x Player Home', 'Access to /kit explorer'], imageUrl: 'https://img.icons8.com/plasticine/100/leather-boot.png' },
  { type: 'Rank', name: 'Warrior', price: 10, features: ['All Explorer Perks', '3x Player Homes', 'Access to /kit warrior', 'Particle Effects'], imageUrl: 'https://img.icons8.com/plasticine/100/sword.png' },
  { type: 'Rank', name: 'Champion', price: 15, features: ['All Warrior Perks', '5x Player Homes', 'Access to /kit champion', 'Fly in Hub'], imageUrl: 'https://img.icons8.com/plasticine/100/shield.png' },
  { type: 'Rank', name: 'Legend', price: 20, originalPrice: 25, features: ['All Champion Perks', '10x Player Homes', 'Access to /kit legend', 'Custom Nickname'], imageUrl: 'https://img.icons8.com/plasticine/100/crown.png', highlighted: true, bonus: 'Best Value' },
];

export const INITIAL_COINS: CoinPackage[] = [
  { type: 'Coin', name: '50 Coins', amount: 50, price: 1, imageUrl: 'https://img.icons8.com/plasticine/100/stack-of-coins.png' },
  { type: 'Coin', name: '100 Coins', amount: 100, price: 1.90, bonus: 'Save 5%', imageUrl: 'https://img.icons8.com/plasticine/100/stack-of-coins.png' },
  { type: 'Coin', name: '250 Coins', amount: 250, price: 5, originalPrice: 6, bonus: 'Best Value', imageUrl: 'https://img.icons8.com/plasticine/100/stack-of-coins.png', highlighted: true },
];