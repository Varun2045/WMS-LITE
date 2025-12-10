import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { useInventory } from '@/context/InventoryContext';
import { Package, DollarSign, AlertTriangle, XCircle, Layers } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { items } = useInventory();

  const stats = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const lowStockItems = items.filter(item => item.status === 'low-stock').length;
    const outOfStockItems = items.filter(item => item.status === 'out-of-stock').length;
    const categories = new Set(items.map(item => item.category)).size;
    
    return { totalItems, totalValue, lowStockItems, outOfStockItems, categories };
  }, [items]);

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Overview of your warehouse inventory" 
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Items"
            value={stats.totalItems.toLocaleString()}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Value"
            value={`$${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={Layers}
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockItems}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStockItems}
            icon={XCircle}
            variant="danger"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
