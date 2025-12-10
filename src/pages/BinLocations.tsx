import { Header } from '@/components/layout/Header';
import { mockBinLocations } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BinLocations() {
  const zones = [...new Set(mockBinLocations.map(b => b.zone))].sort();

  return (
    <div className="min-h-screen">
      <Header 
        title="Bin Locations" 
        subtitle="Warehouse bin allocation and capacity" 
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {zones.map((zone) => {
            const zoneBins = mockBinLocations.filter(b => b.zone === zone);
            const totalCapacity = zoneBins.reduce((acc, b) => acc + b.capacity, 0);
            const totalItems = zoneBins.reduce((acc, b) => acc + b.currentItems, 0);
            const utilization = Math.round((totalItems / totalCapacity) * 100);

            return (
              <div 
                key={zone} 
                className="rounded-xl border border-border bg-card p-6 animate-slide-up"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-lg font-bold text-primary">{zone}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Zone {zone}</h3>
                      <p className="text-xs text-muted-foreground">{zoneBins.length} bins</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className={cn(
                      "font-medium",
                      utilization > 90 ? "text-destructive" : 
                      utilization > 70 ? "text-warning" : "text-success"
                    )}>
                      {utilization}%
                    </span>
                  </div>
                  <Progress 
                    value={utilization} 
                    className={cn(
                      "h-2",
                      utilization > 90 ? "[&>div]:bg-destructive" : 
                      utilization > 70 ? "[&>div]:bg-warning" : "[&>div]:bg-success"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  {zoneBins.map((bin) => {
                    const binUtil = Math.round((bin.currentItems / bin.capacity) * 100);
                    return (
                      <div 
                        key={bin.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono text-muted-foreground">{bin.code}</span>
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          binUtil > 100 ? "text-destructive" :
                          binUtil > 80 ? "text-warning" : "text-muted-foreground"
                        )}>
                          {bin.currentItems}/{bin.capacity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
