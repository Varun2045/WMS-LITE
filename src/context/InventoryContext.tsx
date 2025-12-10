import { createContext, useContext, useState, ReactNode } from 'react';
import { InventoryItem } from '@/types/inventory';
import { mockInventoryItems } from '@/data/mockData';

function getItemStatus(item: Partial<InventoryItem>): InventoryItem['status'] {
  const qty = item.quantity || 0;
  const min = item.minQuantity || 0;
  const max = item.maxQuantity || 100;
  
  if (qty === 0) return 'out-of-stock';
  if (qty < min) return 'low-stock';
  if (qty > max) return 'overstock';
  return 'in-stock';
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Partial<InventoryItem>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  importItems: (items: Partial<InventoryItem>[]) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);

  const addItem = (data: Partial<InventoryItem>) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      sku: data.sku || '',
      name: data.name || '',
      description: data.description || '',
      category: data.category || '',
      quantity: data.quantity || 0,
      minQuantity: data.minQuantity || 0,
      maxQuantity: data.maxQuantity || 100,
      binLocation: data.binLocation || '',
      unitPrice: data.unitPrice || 0,
      lastUpdated: new Date(),
      status: getItemStatus(data),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, data: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, status: getItemStatus({ ...item, ...data }), lastUpdated: new Date() }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const importItems = (newItems: Partial<InventoryItem>[]): number => {
    let imported = 0;
    newItems.forEach(data => {
      const existing = items.find(i => i.sku === data.sku);
      if (existing) {
        updateItem(existing.id, data);
      } else {
        addItem(data);
      }
      imported++;
    });
    return imported;
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, updateItem, deleteItem, importItems }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
