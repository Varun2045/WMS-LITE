import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { InventoryFilters } from '@/components/inventory/InventoryFilters';
import { ItemFormDialog } from '@/components/inventory/ItemFormDialog';
import { useInventory } from '@/context/InventoryContext';
import { InventoryItem } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

export default function Inventory() {
  const { toast } = useToast();
  const { items, addItem, updateItem, deleteItem } = useInventory();
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
    deleteItem(id);
    toast({
      title: 'Item deleted',
      description: 'The inventory item has been removed.',
    });
  };

  const handleSave = (data: Partial<InventoryItem>) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      toast({
        title: 'Item updated',
        description: 'The inventory item has been updated successfully.',
      });
    } else {
      addItem(data);
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
