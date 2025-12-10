import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types/inventory';

interface StatusBadgeProps {
  status: InventoryItem['status'];
}

const statusConfig = {
  'in-stock': { label: 'In Stock', className: 'bg-success/15 text-success' },
  'low-stock': { label: 'Low Stock', className: 'bg-warning/15 text-warning' },
  'out-of-stock': { label: 'Out of Stock', className: 'bg-destructive/15 text-destructive' },
  'overstock': { label: 'Overstock', className: 'bg-primary/15 text-primary' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn("status-badge", config.className)}>
      {config.label}
    </span>
  );
}
