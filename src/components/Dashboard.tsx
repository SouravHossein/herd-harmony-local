import React from 'react';
import { useGoatContext } from '@/context/GoatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Activity, 
  Heart, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Baby,
  Target
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

function StatsCard({ title, value, change, icon, trend = 'neutral' }: StatsCardProps) {
  return (
    <Card className="shadow-card hover:shadow-soft transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={`text-xs ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { 
    getFarmStats, 
    getUpcomingHealthReminders,
    goats,
    healthRecords 
  } = useGoatContext();

  const stats = getFarmStats();
  const upcomingReminders = getUpcomingHealthReminders();
  const recentlyAddedGoats = goats
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentHealthRecords = healthRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Welcome to GoatTracker</h1>
        <p className="text-primary-foreground/80">
          Manage your goat farm with ease. Track health, weight, breeding, and more.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Goats"
          value={stats.totalGoats}
          icon={<Users className="h-6 w-6 text-primary-foreground" />}
        />
        <StatsCard
          title="Active Goats"
          value={stats.activeGoats}
          change={`${Math.round((stats.activeGoats / stats.totalGoats) * 100)}% of total`}
          icon={<Activity className="h-6 w-6 text-primary-foreground" />}
          trend="up"
        />
        <StatsCard
          title="Kids Born This Year"
          value={stats.kidsBornThisYear}
          icon={<Baby className="h-6 w-6 text-primary-foreground" />}
          trend="up"
        />
        <StatsCard
          title="Health Reminders"
          value={stats.upcomingHealthReminders}
          change={stats.upcomingHealthReminders > 0 ? "Action needed" : "All up to date"}
          icon={<Heart className="h-6 w-6 text-primary-foreground" />}
          trend={stats.upcomingHealthReminders > 0 ? "down" : "up"}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breed Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Breed Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.breedDistribution).map(([breed, count]) => {
                const percentage = Math.round((count / stats.totalGoats) * 100);
                return (
                  <div key={breed} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{breed}</span>
                      <span className="text-muted-foreground">{count} goats</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              {Object.keys(stats.breedDistribution).length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No goats added yet. Start by adding your first goat!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Reminders */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Upcoming Health Reminders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map((reminder) => {
                  const goat = goats.find(g => g.id === reminder.goatId);
                  const daysUntilDue = Math.ceil(
                    (new Date(reminder.nextDueDate!).getTime() - new Date().getTime()) / 
                    (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{goat?.name}</p>
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                      </div>
                      <Badge 
                        variant={daysUntilDue <= 7 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {daysUntilDue <= 0 ? 'Overdue' : `${daysUntilDue} days`}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming health reminders. Great job staying on top of care!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Goats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Recently Added Goats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyAddedGoats.length > 0 ? (
                recentlyAddedGoats.map((goat) => (
                  <div key={goat.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium">{goat.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {goat.breed} • Tag #{goat.tagNumber}
                      </p>
                    </div>
                    <Badge 
                      variant={goat.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {goat.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No goats added yet. Start building your herd!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Health Records */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Recent Health Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentHealthRecords.length > 0 ? (
                recentHealthRecords.map((record) => {
                  const goat = goats.find(g => g.id === record.goatId);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{goat?.name}</p>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {record.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No health records yet. Add health tracking for your goats!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gender Distribution */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.maleGoats}</div>
              <div className="text-sm text-muted-foreground">Male Goats</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-accent">{stats.femaleGoats}</div>
              <div className="text-sm text-muted-foreground">Female Goats</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-success">{stats.averageWeight}</div>
              <div className="text-sm text-muted-foreground">Avg Weight (kg)</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <div className="text-2xl font-bold text-warning">{Object.keys(stats.breedDistribution).length}</div>
              <div className="text-sm text-muted-foreground">Breeds</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}