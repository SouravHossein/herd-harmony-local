
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { useGoatData } from '@/hooks/useDatabase';
import { Users, Scale, Heart, Baby } from 'lucide-react';

export function Dashboard() {
  const { goats, weightRecords, healthRecords, breedingRecords } = useGoatData();

  const stats = [
    {
      title: 'Total Goats',
      value: goats.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Weight Records',
      value: weightRecords.length,
      icon: Scale,
      color: 'text-green-600'
    },
    {
      title: 'Health Records',
      value: healthRecords.length,
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Breeding Records',
      value: breedingRecords.length,
      icon: Baby,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your goat farm management system
        </p>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
