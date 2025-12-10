import { Package, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'received' | 'shipped' | 'adjusted' | 'alert';
  item: string;
  quantity: number;
  user: string;
  time: string;
}

const activities: Activity[] = [
  { id: '1', type: 'received', item: 'Industrial Motor 5HP', quantity: 25, user: 'John D.', time: '2 hours ago' },
  { id: '2', type: 'shipped', item: 'Torque Wrench Set', quantity: 8, user: 'Sarah M.', time: '4 hours ago' },
  { id: '3', type: 'alert', item: 'Safety Helmet Type II', quantity: 0, user: 'System', time: '5 hours ago' },
  { id: '4', type: 'adjusted', item: 'Stainless Steel Bearings', quantity: -12, user: 'Mike R.', time: '6 hours ago' },
  { id: '5', type: 'received', item: 'Control Panel 24V', quantity: 50, user: 'John D.', time: '1 day ago' },
];

const typeConfig = {
  received: { icon: ArrowDownRight, color: 'text-success', bg: 'bg-success/10' },
  shipped: { icon: ArrowUpRight, color: 'text-primary', bg: 'bg-primary/10' },
  adjusted: { icon: Package, color: 'text-warning', bg: 'bg-warning/10' },
  alert: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.item}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.type === 'alert' ? 'Out of stock' : `${activity.quantity > 0 ? '+' : ''}${activity.quantity} units`}
                  {' • '}{activity.user}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
