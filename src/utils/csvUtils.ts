import { InventoryItem } from '@/types/inventory';

export function exportToCSV(items: InventoryItem[]): void {
  const headers = ['sku', 'name', 'description', 'category', 'quantity', 'min_quantity', 'max_quantity', 'bin_location', 'unit_price'];
  
  const rows = items.map(item => [
    item.sku,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.description.replace(/"/g, '""')}"`,
    item.category,
    item.quantity,
    item.minQuantity,
    item.maxQuantity,
    item.binLocation,
    item.unitPrice.toFixed(2)
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadTemplate(): void {
  const headers = ['sku', 'name', 'description', 'category', 'quantity', 'min_quantity', 'max_quantity', 'bin_location', 'unit_price'];
  const exampleRow = ['WH-ELC-001', 'Example Product', 'Product description here', 'Electronics', '100', '20', '200', 'A-01-01-A', '49.99'];
  
  const csv = [headers.join(','), exampleRow.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'inventory_template.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function parseCSV(text: string): Partial<InventoryItem>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  const items: Partial<InventoryItem>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
    if (values.length >= 9) {
      items.push({
        sku: values[0],
        name: values[1],
        description: values[2],
        category: values[3],
        quantity: parseInt(values[4]) || 0,
        minQuantity: parseInt(values[5]) || 0,
        maxQuantity: parseInt(values[6]) || 100,
        binLocation: values[7],
        unitPrice: parseFloat(values[8]) || 0,
      });
    }
  }
  
  return items;
}
