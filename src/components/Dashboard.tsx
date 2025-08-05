import React, { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Heart, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BackendStatus from './BackendStatus';
import  * as useGoatDataLocal  from '@/hooks/useLocalStorageOnly';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [weather, setWeather] = useState({ temperature: null, description: null });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=YOUR_API_KEY&units=metric`
        );
        const data = await response.json();
        setWeather({
          temperature: data?.main?.temp,
          description: data?.weather?.[0]?.description,
        });
      } catch (error) {
        console.error("Failed to fetch weather data", error);
      }
    };

    fetchWeather();
  }, []);

  // Replace useGoatData with local version
  const { goats, weightRecords, healthRecords } = useGoatDataLocal.useGoatData();
  const isElectronAvailable = Boolean(window.electronAPI?.isElectron);

  const totalGoats = goats.length;
  const activeGoats = goats.filter(goat => goat.status === 'active').length;
  const maleGoats = goats.filter(goat => goat.gender === 'male').length;
  const femaleGoats = goats.filter(goat => goat.gender === 'female').length;

  const kidsBornThisYear = goats.filter(goat => {
    const birthYear = new Date(goat.dateOfBirth).getFullYear();
    return birthYear === new Date().getFullYear();
  }).length;

  const upcomingHealthReminders = healthRecords.filter(record => {
    return record.status === 'scheduled' && new Date(record.nextDueDate || record.date) >= new Date();
  }).length;

  const totalWeight = weightRecords.reduce((sum, record) => sum + record.weight, 0);
  const averageWeight = weightRecords.length > 0 ? totalWeight / weightRecords.length : 0;

  const breedDistribution = goats.reduce((acc: { [key: string]: number }, goat) => {
    acc[goat.breed] = (acc[goat.breed] || 0) + 1;
    return acc;
  }, {});

  const breedLabels = Object.keys(breedDistribution);
  const breedData = Object.values(breedDistribution);

  const chartData = {
    labels: breedLabels,
    datasets: [
      {
        label: 'Number of Goats',
        data: breedData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Breed Distribution',
      },
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <BackendStatus isElectronAvailable={isElectronAvailable} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Farm Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your goat farm operations and key metrics
          </p>
        </div>
        <div className="flex space-x-4">
          <WeatherWidget />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Goats</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{totalGoats}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Goats</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{activeGoats}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Male Goats</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{maleGoats}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Female Goats</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{femaleGoats}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kids Born This Year</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{kidsBornThisYear}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg. Weight</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{averageWeight.toFixed(2)} kg</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Reminders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{upcomingHealthReminders}</span>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Breed Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar options={chartOptions} data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
