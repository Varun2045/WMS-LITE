import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, RefreshCw, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Discrepancy {
  id: string;
  sku: string;
  name: string;
  systemQty: number;
  physicalQty: number;
  difference: number;
  binLocation: string;
  status: 'pending' | 'resolved' | 'investigating';
}

const mockDiscrepancies: Discrepancy[] = [
  { id: '1', sku: 'WH-MEC-015', name: 'Stainless Steel Bearings', systemQty: 20, physicalQty: 8, difference: -12, binLocation: 'B-03-01-C', status: 'pending' },
  { id: '2', sku: 'WH-SAF-042', name: 'Safety Helmet Type II', systemQty: 5, physicalQty: 0, difference: -5, binLocation: 'C-02-04-B', status: 'investigating' },
  { id: '3', sku: 'WH-ELC-022', name: 'Control Panel 24V', systemQty: 100, physicalQty: 120, difference: 20, binLocation: 'D-01-01-A', status: 'pending' },
];

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning border-warning/20' },
  resolved: { label: 'Resolved', className: 'bg-success/15 text-success border-success/20' },
  investigating: { label: 'Investigating', className: 'bg-primary/15 text-primary border-primary/20' },
};

export default function Reconciliation() {
  const { toast } = useToast();
  const [discrepancies, setDiscrepancies] = useState(mockDiscrepancies);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: 'Scan complete',
        description: 'Found 3 discrepancies requiring attention.',
      });
    }, 2000);
  };

  const handleResolve = (id: string) => {
    setDiscrepancies(prev => 
      prev.map(d => d.id === id ? { ...d, status: 'resolved' as const } : d)
    );
    toast({
      title: 'Discrepancy resolved',
      description: 'The inventory count has been updated.',
    });
  };

  const pendingCount = discrepancies.filter(d => d.status === 'pending').length;
  const investigatingCount = discrepancies.filter(d => d.status === 'investigating').length;

  return (
    <div className="min-h-screen">
      <Header 
        title="Reconciliation" 
        subtitle="Identify and resolve inventory discrepancies" 
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Issues</p>
                  <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investigating</p>
                  <p className="text-2xl font-bold text-primary">{investigatingCount}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Scan</p>
                  <p className="text-2xl font-bold text-foreground">2h ago</p>
                </div>
                <FileCheck className="h-8 w-8 text-muted-foreground/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Discrepancy Report</CardTitle>
                <CardDescription>Review and resolve inventory count mismatches</CardDescription>
              </div>
              <Button onClick={handleScan} disabled={isScanning} className="gap-2">
                <RefreshCw className={cn("h-4 w-4", isScanning && "animate-spin")} />
                {isScanning ? 'Scanning...' : 'Run Scan'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Bin</TableHead>
                  <TableHead className="text-right">System</TableHead>
                  <TableHead className="text-right">Physical</TableHead>
                  <TableHead className="text-right">Diff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discrepancies.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.binLocation}</TableCell>
                    <TableCell className="text-right">{item.systemQty}</TableCell>
                    <TableCell className="text-right">{item.physicalQty}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      item.difference > 0 ? "text-success" : "text-destructive"
                    )}>
                      {item.difference > 0 ? '+' : ''}{item.difference}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={statusConfig[item.status].className}
                      >
                        {statusConfig[item.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status !== 'resolved' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleResolve(item.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
