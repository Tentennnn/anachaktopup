export interface Rank {
  type: 'Rank';
  name: string;
  price: number;
  features: string[];
  imageUrl: string;
  highlighted?: boolean;
}

export interface CoinPackage {
  type: 'Coin';
  name: string;
  amount: number;
  price: number;
  bonus?: string;
  imageUrl: string;
  highlighted?: boolean;
}

export type StoreItem = Rank | CoinPackage;

export interface RecentPurchase {
  _id: string;
  username: string;
  item: string;
  createdAt: string; // ISO date string
}
