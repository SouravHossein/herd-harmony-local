
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoatContext } from '@/context/GoatContext';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import  GoatManagement  from '@/components/GoatManagement';

import { HealthDashboard } from '@/components/HealthDashboard';
import { FeedDashboard } from '@/components/feed/FeedDashboard';
import FinanceDashboard from '@/components/finance/FinanceDashboard';
import {
  Users, Heart, TrendingUp, DollarSign, Bell, Activity,
  Plus, Calendar, BarChart3, Settings, AlertTriangle
} from 'lucide-react';

export default function AllInOneDashboard() {
  const [activeWorkspace, setActiveWorkspace] = useState('overview');
  const {
    goats,
    weightRecords,
    healthRecords,
    breedingRecords,
    financeRecords,
    getUpcomingHealthReminders,
    loading,
    error
  } = useGoatContext();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <div className="text-destructive font-medium">Error loading dashboard data</div>
          <div className="text-sm text-muted-foreground mt-1">{error}</div>
        </div>
      </div>
    );
  }

  // Calculate farm statistics
  const stats = {
    totalGoats: goats.length,
    activeGoats: goats.filter(goat => goat.status === 'active').length,
    kidsBornThisYear: goats.filter(goat => {
      const birthYear = new Date(goat.dateOfBirth).getFullYear();
      return birthYear === new Date().getFullYear();
    }).length,
    upcomingReminders: getUpcomingHealthReminders().length,
    averageWeight: weightRecords.length > 0 
      ? Math.round((weightRecords.reduce((sum, r) => sum + r.weight, 0) / weightRecords.length) * 10) / 10
      : 0,
    recentBreedings: breedingRecords.filter(br => {
      const breedingDate = new Date(br.breedingDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return breedingDate >= thirtyDaysAgo;
    }).length,
    totalFinanceValue: financeRecords.reduce((sum, fr) => 
      fr.type === 'income' ? sum + fr.amount : sum - fr.amount, 0
    )
  };

  const quickActions = [
    { label: 'Add Goat', icon: Plus, action: () => setActiveWorkspace('goats'), color: 'bg-blue-500' },
    { label: 'Record Weight', icon: TrendingUp, action: () => setActiveWorkspace('weight'), color: 'bg-green-500' },
    { label: 'Health Check', icon: Heart, action: () => setActiveWorkspace('health'), color: 'bg-red-500' },
    { label: 'Feed Management', icon: Activity, action: () => setActiveWorkspace('feed'), color: 'bg-yellow-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Environment Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farm Workspace</h1>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-muted-foreground">All-in-one farm management dashboard</p>
            <Badge variant={window.electronAPI?.isElectron ? "default" : "secondary"}>
              {window.electronAPI?.isElectron ? "Desktop Mode" : "Browser Mode"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <WeatherWidget />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveWorkspace('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveWorkspace('goats')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeGoats} active • {stats.totalGoats - stats.activeGoats} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveWorkspace('health')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingReminders}</div>
            <p className="text-xs text-muted-foreground">Upcoming reminders</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveWorkspace('weight')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWeight} kg</div>
            <p className="text-xs text-muted-foreground">Across {weightRecords.length} records</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveWorkspace('finance')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.abs(stats.totalFinanceValue).toFixed(2)}</div>
            <Badge variant={stats.totalFinanceValue >= 0 ? "default" : "destructive"} className="text-xs">
              {stats.totalFinanceValue >= 0 ? "Profit" : "Loss"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={action.action}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Workspace Tabs */}
      <Card className="min-h-[600px]">
        <CardContent className="p-0">
          <Tabs value={activeWorkspace} onValueChange={setActiveWorkspace} className="w-full">
            <div className="border-b px-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="goats">Goats</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentBreedings > 0 && (
                        <div className="flex items-center space-x-4">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <div>
                            <p className="text-sm font-medium">{stats.recentBreedings} recent breedings</p>
                            <p className="text-xs text-muted-foreground">In the last 30 days</p>
                          </div>
                        </div>
                      )}
                      {weightRecords.length > 0 && (
                        <div className="flex items-center space-x-4">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">{weightRecords.length} weight records</p>
                            <p className="text-xs text-muted-foreground">Average: {stats.averageWeight} kg</p>
                          </div>
                        </div>
                      )}
                      {stats.upcomingReminders > 0 && (
                        <div className="flex items-center space-x-4">
                          <Bell className="w-4 h-4 text-orange-500" />
                          <div>
                            <p className="text-sm font-medium">{stats.upcomingReminders} health reminders</p>
                            <p className="text-xs text-muted-foreground">Require attention</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Farm Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Farm Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Goats:</span>
                        <span className="font-medium">{stats.totalGoats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Kids This Year:</span>
                        <span className="font-medium">{stats.kidsBornThisYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Health Records:</span>
                        <span className="font-medium">{healthRecords.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Finance Records:</span>
                        <span className="font-medium">{financeRecords.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goats" className="p-6">
              <GoatManagement />
            </TabsContent>

            <TabsContent value="health" className="p-6">
              <HealthDashboard />
            </TabsContent>

            <TabsContent value="weight" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Weight Tracking</h3>
                <p className="text-muted-foreground">Weight tracking functionality integrated into Health dashboard.</p>
                <Button onClick={() => setActiveWorkspace('health')}>
                  Go to Health Dashboard
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="feed" className="p-6">
              <FeedDashboard />
            </TabsContent>

            <TabsContent value="finance" className="p-6">
              <FinanceDashboard />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
