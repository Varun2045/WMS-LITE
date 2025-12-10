import { useRef, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileSpreadsheet, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/context/InventoryContext';
import { exportToCSV, downloadTemplate, parseCSV } from '@/utils/csvUtils';

export default function ImportExport() {
  const { toast } = useToast();
  const { items, importItems } = useInventory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportToCSV(items);
      setIsExporting(false);
      toast({
        title: 'Export complete',
        description: `Exported ${items.length} inventory items to CSV.`,
      });
    }, 500);
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
    toast({
      title: 'Template downloaded',
      description: 'Use this template to format your import data.',
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedItems = parseCSV(text);
      const count = importItems(parsedItems);
      setIsImporting(false);
      toast({
        title: 'Import complete',
        description: `Successfully imported ${count} items.`,
      });
    };
    reader.onerror = () => {
      setIsImporting(false);
      toast({
        title: 'Import failed',
        description: 'Could not read the file. Please try again.',
        variant: 'destructive',
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Import / Export" 
        subtitle="Bulk inventory data management" 
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Export Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Export Inventory</CardTitle>
                  <CardDescription>Download your inventory as CSV</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {items.length} inventory items with details
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Bin locations and quantities
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Status and pricing data
                </div>
              </div>
              <Button className="w-full gap-2" onClick={handleExport} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Export to CSV
              </Button>
            </CardContent>
          </Card>

          {/* Import Card */}
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Import Inventory</CardTitle>
                  <CardDescription>Upload CSV to update inventory</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                className="rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                onClick={handleDropZoneClick}
              >
                {isImporting ? (
                  <Loader2 className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                )}
                <p className="text-sm font-medium text-foreground">
                  {isImporting ? 'Importing...' : 'Drop your CSV file here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={handleDownloadTemplate}>
                <FileSpreadsheet className="h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-4xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">CSV Format Guide</h3>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Your CSV file should include the following columns:
            </p>
            <div className="font-mono text-xs bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <span className="text-primary">sku</span>,
              <span className="text-accent">name</span>,
              <span className="text-success">description</span>,
              <span className="text-warning">category</span>,
              <span className="text-destructive">quantity</span>,
              <span className="text-primary">min_quantity</span>,
              <span className="text-accent">max_quantity</span>,
              <span className="text-success">bin_location</span>,
              <span className="text-warning">unit_price</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
