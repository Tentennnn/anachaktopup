export interface Rank {
  type: 'Rank';
  name: string;
  price: number;
  features: string[];
  imageUrl: string;
}

export interface CoinPackage {
  type: 'Coin';
  name: string;
  amount: number;
  price: number;
  bonus?: string;
  imageUrl: string;
}

export type StoreItem = Rank | CoinPackage;