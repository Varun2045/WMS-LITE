import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Bell, Database, Users, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: 'admin' | 'operator';
}

export default function Settings() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@warehouse.com', initials: 'AD', role: 'admin' },
    { id: '2', name: 'Operator One', email: 'operator@warehouse.com', initials: 'OP', role: 'operator' },
  ]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState('wms_live_' + Math.random().toString(36).substring(2, 18));
  
  const [notifications, setNotifications] = useState({
    lowStock: true,
    reconciliation: true,
    emailReports: false,
  });

  const handleManageUsers = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'operator';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, name, email, role, initials } : u));
      toast({ title: 'User updated', description: `${name} has been updated.` });
    } else {
      setUsers(prev => [...prev, { id: Date.now().toString(), name, email, role, initials }]);
      toast({ title: 'User added', description: `${name} has been added.` });
    }
    setUserDialogOpen(false);
  };

  const handleRegenerateKey = () => {
    setApiKey('wms_live_' + Math.random().toString(36).substring(2, 18));
    toast({ title: 'API Key regenerated', description: 'Your new API key is ready to use.' });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({ title: 'Copied', description: 'API key copied to clipboard.' });
  };

  const handleBackup = () => {
    const data = { users, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wms_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: 'Backup created', description: 'Your settings have been backed up.' });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Manage your warehouse preferences" 
      />

      <div className="p-6 max-w-4xl space-y-6">
        {/* User Management */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border divide-y divide-border">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={user.role === 'admin' ? 'bg-primary/15 text-primary border-0' : ''} variant={user.role === 'operator' ? 'secondary' : 'default'}>
                    {user.role === 'admin' ? 'Admin' : 'Operator'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={handleManageUsers}>Add User</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure alert preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when items fall below minimum quantity</p>
              </div>
              <Switch 
                checked={notifications.lowStock} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, lowStock: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Reconciliation Reminders</Label>
                <p className="text-sm text-muted-foreground">Weekly reminder to run inventory counts</p>
              </div>
              <Switch 
                checked={notifications.reconciliation}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reconciliation: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Reports</Label>
                <p className="text-sm text-muted-foreground">Receive daily inventory summary by email</p>
              </div>
              <Switch 
                checked={notifications.emailReports}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailReports: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Database className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle>Database Settings</CardTitle>
                <CardDescription>Storage and backup configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Database Type</Label>
                <Input value="SQLite" disabled />
              </div>
              <div className="space-y-2">
                <Label>Storage Used</Label>
                <Input value="2.4 MB / 10 GB" disabled />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBackup}>Create Backup</Button>
              <Button variant="outline" onClick={() => toast({ title: 'Restore', description: 'Upload a backup file to restore settings.' })}>
                Restore Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>API keys and authentication</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input type="text" value={apiKey} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopyKey}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleRegenerateKey}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use this key to access the REST API endpoints</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription>Manage user access to the warehouse system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingUser?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={editingUser?.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={editingUser?.role || 'operator'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingUser ? 'Save' : 'Add User'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
