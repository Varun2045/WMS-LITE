import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { mockStats } from '@/data/mockData';
import { Package, DollarSign, AlertTriangle, XCircle, Layers } from 'lucide-react';

export default function Dashboard() {
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
            value={mockStats.totalItems.toLocaleString()}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Value"
            value={`$${mockStats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Categories"
            value={mockStats.categories}
            icon={Layers}
          />
          <StatCard
            title="Low Stock"
            value={mockStats.lowStockItems}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Out of Stock"
            value={mockStats.outOfStockItems}
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
