import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Shield, Bell, Database, Users } from 'lucide-react';

export default function Settings() {
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
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    AD
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Admin User</p>
                    <p className="text-sm text-muted-foreground">admin@warehouse.com</p>
                  </div>
                </div>
                <Badge className="bg-primary/15 text-primary border-0">Admin</Badge>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
                    OP
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Operator One</p>
                    <p className="text-sm text-muted-foreground">operator@warehouse.com</p>
                  </div>
                </div>
                <Badge variant="secondary">Operator</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">Manage Users</Button>
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Reconciliation Reminders</Label>
                <p className="text-sm text-muted-foreground">Weekly reminder to run inventory counts</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Reports</Label>
                <p className="text-sm text-muted-foreground">Receive daily inventory summary by email</p>
              </div>
              <Switch />
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
              <Button variant="outline">Create Backup</Button>
              <Button variant="outline">Restore Backup</Button>
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
                <Input type="password" value="wms_live_xxxxxxxxxxxxxxxx" readOnly className="font-mono" />
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-xs text-muted-foreground">Use this key to access the REST API endpoints</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
