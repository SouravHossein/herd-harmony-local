
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/ThemeContext';
import { Monitor, Moon, Sun, Palette, Database, Shield } from 'lucide-react';
import { DataManagement } from '@/components/DataManagement';
import { BackupManager } from '@/components/BackupManager';

const accentColors = [
  { value: 'sage', label: 'Sage Green', color: 'hsl(120, 25%, 35%)' },
  { value: 'blue', label: 'Blue', color: 'hsl(221, 83%, 53%)' },
  { value: 'green', label: 'Green', color: 'hsl(142, 76%, 36%)' },
  { value: 'orange', label: 'Orange', color: 'hsl(25, 95%, 53%)' },
  { value: 'purple', label: 'Purple', color: 'hsl(262, 83%, 58%)' },
  { value: 'pink', label: 'Pink', color: 'hsl(330, 81%, 60%)' },
  { value: 'red', label: 'Red', color: 'hsl(0, 84%, 60%)' },
  { value: 'yellow', label: 'Yellow', color: 'hsl(48, 96%, 53%)' }
];

export default function Settings() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your application appearance, manage data, and configure backups
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Appearance</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                      className="flex-1"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                      className="flex-1"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('system')}
                      className="flex-1"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accent Color Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Accent Color
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {accentColors.map((color) => (
                      <Button
                        key={color.value}
                        variant={accentColor === color.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAccentColor(color.value as any)}
                        className="h-10 p-0"
                        style={{
                          backgroundColor: accentColor === color.value ? color.color : undefined
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.color }}
                        />
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current: {accentColors.find(c => c.value === accentColor)?.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <DataManagement />
        </TabsContent>

        <TabsContent value="backup">
          <BackupManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
