
import React, { useState, useEffect } from 'react';
import { useGoatContext } from '@/context/GoatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Syringe,
  Bell,
  Activity,
  Shield
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function HealthDashboard() {
  const { goats, healthRecords, getUpcomingHealthReminders } = useGoatContext();
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);
  const [vaccinationCoverage, setVaccinationCoverage] = useState(0);
  const [healthStats, setHealthStats] = useState({
    totalHealthRecords: 0,
    vaccinationsThisMonth: 0,
    treatmentsThisMonth: 0,
    dewormingThisMonth: 0,
  });

  useEffect(() => {
    const loadHealthData = () => {
      const upcoming = getUpcomingHealthReminders();
      const now = new Date();
      
      // Separate upcoming and overdue tasks
      const upcomingList = upcoming.filter(task => 
        task.nextDueDate && new Date(task.nextDueDate) > now
      );
      const overdueList = upcoming.filter(task => 
        task.nextDueDate && new Date(task.nextDueDate) <= now
      );
      
      setUpcomingTasks(upcomingList.slice(0, 5));
      setOverdueTasks(overdueList.slice(0, 5));
      
      // Calculate vaccination coverage
      const activeGoats = goats.filter(g => g.status === 'active');
      const vaccinatedGoats = activeGoats.filter(goat => 
        healthRecords.some(record => 
          record.goatId === goat.id && 
          record.type === 'vaccination' &&
          new Date(record.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        )
      );
      setVaccinationCoverage(activeGoats.length > 0 ? (vaccinatedGoats.length / activeGoats.length) * 100 : 0);
      
      // Calculate monthly stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRecords = healthRecords.filter(record => 
        new Date(record.date) >= thisMonth
      );
      
      setHealthStats({
        totalHealthRecords: healthRecords.length,
        vaccinationsThisMonth: monthlyRecords.filter(r => r.type === 'vaccination').length,
        treatmentsThisMonth: monthlyRecords.filter(r => r.type === 'treatment').length,
        dewormingThisMonth: monthlyRecords.filter(r => r.type === 'deworming').length,
      });
    };
    
    loadHealthData();
  }, [goats, healthRecords, getUpcomingHealthReminders]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Health AI Notifications Enabled', {
          body: 'You will now receive reminders for upcoming health tasks.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Health AI Dashboard</h2>
          <p className="text-muted-foreground">Smart health monitoring and automated reminders</p>
        </div>
        <Button onClick={requestNotificationPermission} className="bg-gradient-primary">
          <Bell className="h-4 w-4 mr-2" />
          Enable Notifications
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vaccination Coverage</p>
                <p className="text-2xl font-bold text-primary">{vaccinationCoverage.toFixed(1)}%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Progress value={vaccinationCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">{healthStats.vaccinationsThisMonth}</p>
                <p className="text-xs text-muted-foreground">Vaccinations</p>
              </div>
              <Syringe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Treatments</p>
                <p className="text-2xl font-bold text-foreground">{healthStats.treatmentsThisMonth}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold text-foreground">{healthStats.totalHealthRecords}</p>
                <p className="text-xs text-muted-foreground">All Time</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueTasks.length > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>{overdueTasks.length} overdue health tasks</strong> require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Upcoming Health Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const goat = goats.find(g => g.id === task.goatId);
                  const daysUntilDue = Math.ceil(
                    (new Date(task.nextDueDate!).getTime() - new Date().getTime()) / 
                    (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{goat?.name}</p>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {daysUntilDue} days
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No upcoming tasks</p>
            )}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Overdue Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length > 0 ? (
              <div className="space-y-3">
                {overdueTasks.map((task) => {
                  const goat = goats.find(g => g.id === task.goatId);
                  const daysOverdue = Math.ceil(
                    (new Date().getTime() - new Date(task.nextDueDate!).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">{goat?.name}</p>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {daysOverdue} days overdue
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-muted-foreground">No overdue tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
