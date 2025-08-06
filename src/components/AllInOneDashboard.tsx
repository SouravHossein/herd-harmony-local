import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoatContext } from '@/context/GoatContext';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import GoatManagement from '@/components/GoatManagement';
import { HealthDashboard } from '@/components/HealthDashboard';
import { FeedDashboard } from '@/components/feed/FeedDashboard';
import FinanceDashboard from '@/components/finance/FinanceDashboard';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { GettingStartedChecklist } from '@/components/onboarding/GettingStartedChecklist';
import { SmartNotifications } from '@/components/notifications/SmartNotifications';
import { FarmHealthScore } from '@/components/notifications/FarmHealthScore';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ActionableAlerts } from '@/components/dashboard/ActionableAlerts';
import { QuickActionCenter } from '@/components/dashboard/QuickActionCenter';
import { UsageStreaks } from '@/components/dashboard/UsageStreaks';
import { SmartSuggestions } from '@/components/dashboard/SmartSuggestions';
import { useAlerts } from '@/hooks/useAlerts';
import { useNavigate } from 'react-router-dom';
import {
  Users, Heart, TrendingUp, DollarSign, Bell, Activity,
  Plus, Calendar, BarChart3, Settings, AlertTriangle, Sparkles
} from 'lucide-react';

export default function AllInOneDashboard() {
  const [activeWorkspace, setActiveWorkspace] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showChecklist, setShowChecklist] = useState(true);
  
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

  const { alerts, healthMetrics, dismissAlert, clearDismissedAlerts, getCriticalAlerts } = useAlerts();

  // Check if user is new (no goats added yet)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('herd-harmony-onboarding-completed');
    if (!hasSeenOnboarding && goats.length === 0) {
      setShowOnboarding(true);
    }
  }, [goats.length]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('herd-harmony-onboarding-completed', 'true');
    setShowOnboarding(false);
    setShowChecklist(true);
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('herd-harmony-onboarding-completed', 'true');
    setShowOnboarding(false);
    setShowChecklist(true);
  };

  const handleAlertAction = (alert: any) => {
    // Navigate to the appropriate section based on alert
    if (alert.actionUrl) {
      const sectionMap: Record<string, string> = {
        '/health': 'health',
        '/weight': 'health',
        '/breeding': 'breeding',
        '/finance': 'finance',
        '/feed': 'feed'
      };
      const section = sectionMap[alert.actionUrl];
      if (section) {
        setActiveWorkspace(section);
      }
    }
  };

  const handleHealthScoreImprove = (category: string) => {
    const sectionMap: Record<string, string> = {
      'health': 'health',
      'weight': 'health',
      'breeding': 'breeding',
      'finance': 'finance'
    };
    const section = sectionMap[category];
    if (section) {
      setActiveWorkspace(section);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'add-goat':
        setActiveWorkspace('goats');
        break;
      case 'record-weight':
        setActiveWorkspace('health');
        break;
      case 'log-health':
        setActiveWorkspace('health');
        break;
      case 'add-expense':
        setActiveWorkspace('finance');
        break;
      case 'generate-report':
        // TODO: Implement report generation
        console.log('Generate report action');
        break;
      case 'feed-management':
        setActiveWorkspace('feed');
        break;
    }
  };

  const handleSuggestionClick = (action: string) => {
    switch (action) {
      case 'generate-health-report':
        setActiveWorkspace('health');
        break;
      case 'record-weights':
        setActiveWorkspace('health');
        break;
      case 'review-breeding':
        setActiveWorkspace('breeding');
        break;
      case 'backup-data':
        setActiveWorkspace('settings');
        break;
      case 'complete-profiles':
        setActiveWorkspace('goats');
        break;
      default:
        console.log('Suggestion action:', action);
    }
  };

  // Show onboarding wizard if needed
  if (showOnboarding) {
    return (
      <OnboardingWizard
        onComplete={handleCompleteOnboarding}
        onSkip={handleSkipOnboarding}
      />
    );
  }

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

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalAlerts = getCriticalAlerts();

  return (
    <div className="space-y-6">
      {/* Header with Environment Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span>Herd Harmony</span>
          </h1>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-muted-foreground">Intelligent farm management workspace</p>
            <Badge variant={window.electronAPI?.isElectron ? "default" : "secondary"}>
              {window.electronAPI?.isElectron ? "Desktop Mode" : "Browser Mode"}
            </Badge>
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <WeatherWidget />
          {activeAlerts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveWorkspace('notifications')}
              className="relative"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
              <Badge variant="destructive" className="ml-2">
                {activeAlerts.length}
              </Badge>
            </Button>
          )}
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

      {/* Getting Started Checklist */}
      {showChecklist && (
        <GettingStartedChecklist
          onClose={() => setShowChecklist(false)}
          onNavigate={setActiveWorkspace}
        />
      )}

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <h3 className="font-semibold text-destructive">Critical Alerts Require Attention</h3>
                  <p className="text-sm text-muted-foreground">
                    {criticalAlerts.length} critical task{criticalAlerts.length > 1 ? 's' : ''} need immediate attention
                  </p>
                </div>
              </div>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => setActiveWorkspace('notifications')}
              >
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveWorkspace('health')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farm Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthMetrics.score >= 80 ? 'text-green-600' : healthMetrics.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {healthMetrics.score}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthMetrics.score >= 80 ? 'Excellent' : healthMetrics.score >= 60 ? 'Good' : 'Needs Attention'}
            </p>
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

      {/* Main Workspace Tabs */}
      <Card className="min-h-[600px]">
        <CardContent className="p-0">
          <Tabs value={activeWorkspace} onValueChange={setActiveWorkspace} className="w-full">
            <div className="border-b px-4">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="goats">Goats</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="notifications" className="relative">
                  Alerts
                  {activeAlerts.length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {activeAlerts.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Enhanced Overview Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Farm Health & Engagement */}
                <div className="lg:col-span-3 space-y-6">
                  <FarmHealthScore 
                    metrics={healthMetrics}
                    onImprove={handleHealthScoreImprove}
                  />
                  <UsageStreaks />
                </div>

                {/* Center Column - Priority Actions */}
                <div className="lg:col-span-6 space-y-6">
                  <ActionableAlerts
                    alerts={activeAlerts}
                    onActionClick={handleAlertAction}
                    maxDisplay={6}
                  />
                </div>

                {/* Right Column - Quick Actions & Suggestions */}
                <div className="lg:col-span-3 space-y-6">
                  <QuickActionCenter onAction={handleQuickAction} />
                  <SmartSuggestions
                    alerts={activeAlerts}
                    onSuggestionClick={handleSuggestionClick}
                    maxDisplay={3}
                  />
                </div>
              </div>

              {/* Farm Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <TabsContent value="feed" className="p-6">
              <FeedDashboard />
            </TabsContent>

            <TabsContent value="finance" className="p-6">
              <FinanceDashboard />
            </TabsContent>

            <TabsContent value="notifications" className="p-6">
              <NotificationCenter
                alerts={alerts}
                onDismiss={dismissAlert}
                onAction={handleAlertAction}
                onClearDismissed={clearDismissedAlerts}
              />
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="text-muted-foreground">Settings functionality will be implemented here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
