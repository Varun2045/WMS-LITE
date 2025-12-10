export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  binLocation: string;
  unitPrice: number;
  lastUpdated: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

export interface BinLocation {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacity: number;
  currentItems: number;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: number;
}

export type UserRole = 'admin' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
