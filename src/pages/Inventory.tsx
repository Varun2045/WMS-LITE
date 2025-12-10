import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { InventoryFilters } from '@/components/inventory/InventoryFilters';
import { ItemFormDialog } from '@/components/inventory/ItemFormDialog';
import { mockInventoryItems } from '@/data/mockData';
import { InventoryItem } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

function getItemStatus(item: Partial<InventoryItem>): InventoryItem['status'] {
  const qty = item.quantity || 0;
  const min = item.minQuantity || 0;
  const max = item.maxQuantity || 100;
  
  if (qty === 0) return 'out-of-stock';
  if (qty < min) return 'low-stock';
  if (qty > max) return 'overstock';
  return 'in-stock';
}

export default function Inventory() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (status !== 'all' && item.status !== status) return false;
      return true;
    });
  }, [items, category, status]);

  const handleAddNew = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Item deleted',
      description: 'The inventory item has been removed.',
    });
  };

  const handleSave = (data: Partial<InventoryItem>) => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...data, status: getItemStatus(data), lastUpdated: new Date() }
          : item
      ));
      toast({
        title: 'Item updated',
        description: 'The inventory item has been updated successfully.',
      });
    } else {
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
      toast({
        title: 'Item added',
        description: 'The new inventory item has been created.',
      });
    }
  };

  const clearFilters = () => {
    setCategory('all');
    setStatus('all');
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Inventory" 
        subtitle={`${filteredItems.length} items`}
        onAddNew={handleAddNew}
        addNewLabel="Add Item"
      />

      <div className="p-6 space-y-4">
        <InventoryFilters
          category={category}
          status={status}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />

        <InventoryTable
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <ItemFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSave={handleSave}
      />
    </div>
  );
}
