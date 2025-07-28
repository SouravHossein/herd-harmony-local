
import React, { useState, useMemo } from 'react';
import { useGoatContext } from '@/context/GoatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Trophy,
  Activity,
  Scale
} from 'lucide-react';
import { GrowthAI } from '@/lib/growthAI';

export function GrowthOptimizer() {
  const { goats, weightRecords, getGoatWeightHistory } = useGoatContext();
  const [selectedGoatId, setSelectedGoatId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('overview');

  const activeGoats = goats.filter(goat => goat.status === 'active');
  const selectedGoat = goats.find(goat => goat.id === selectedGoatId);

  // Calculate growth performances for all goats
  const growthPerformances = useMemo(() => {
    return activeGoats.map(goat => 
      GrowthAI.calculateGrowthPerformanceScore(goat, weightRecords, [])
    );
  }, [activeGoats, weightRecords]);

  // Get analytics
  const analytics = useMemo(() => {
    return GrowthAI.calculateHerdAnalytics(activeGoats, weightRecords, []);
  }, [activeGoats, weightRecords]);

  // Get insights
  const insights = useMemo(() => {
    return GrowthAI.generateInsights(activeGoats, weightRecords, []);
  }, [activeGoats, weightRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above-standard': return 'text-green-600';
      case 'on-track': return 'text-blue-600';
      case 'below-standard': return 'text-yellow-600';
      case 'concerning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'above-standard': return <Trophy className="h-4 w-4" />;
      case 'on-track': return <CheckCircle className="h-4 w-4" />;
      case 'below-standard': return <Activity className="h-4 w-4" />;
      case 'concerning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Scale className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Growth Optimizer</h2>
          <p className="text-muted-foreground">Monitor growth performance and optimize feeding strategies</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Herd Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average GPS</p>
                    <p className="text-2xl font-bold">{analytics.averageHerdGPS}%</p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                    <p className="text-2xl font-bold">{analytics.topPerformers.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                    <p className="text-2xl font-bold">{analytics.underPerformers.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Goats</p>
                    <p className="text-2xl font-bold">{activeGoats.length}</p>
                  </div>
                  <Scale className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Performance Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Performance Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {growthPerformances
                  .sort((a, b) => b.currentScore - a.currentScore)
                  .slice(0, 10)
                  .map((performance, index) => {
                    const goat = goats.find(g => g.id === performance.goatId);
                    if (!goat) return null;

                    return (
                      <div key={goat.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{goat.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {goat.breed} • Tag #{goat.tagNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">{performance.currentScore}%</p>
                            <div className="flex items-center space-x-1">
                              <span className={`text-xs ${getStatusColor(performance.status)}`}>
                                {getStatusIcon(performance.status)}
                              </span>
                              <span className="text-xs text-muted-foreground capitalize">
                                {performance.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress 
                              value={Math.min(performance.currentScore, 100)} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Herd Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Herd Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.growthTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="averageGPS" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Tab */}
        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Select Goat:</label>
                <Select value={selectedGoatId} onValueChange={setSelectedGoatId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Choose a goat" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeGoats.map((goat) => (
                      <SelectItem key={goat.id} value={goat.id}>
                        {goat.name} (Tag #{goat.tagNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedGoat && (
            <IndividualGoatAnalysis 
              goat={selectedGoat} 
              weightRecords={getGoatWeightHistory(selectedGoat.id)}
              performance={growthPerformances.find(p => p.goatId === selectedGoat.id)}
            />
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breed Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Breed Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(analytics.breedComparison).map(([breed, score]) => ({ breed, score }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="breed" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Above Standard (>110%)', count: growthPerformances.filter(p => p.currentScore >= 110).length, color: 'bg-green-500' },
                    { label: 'On Track (90-110%)', count: growthPerformances.filter(p => p.currentScore >= 90 && p.currentScore < 110).length, color: 'bg-blue-500' },
                    { label: 'Below Standard (70-90%)', count: growthPerformances.filter(p => p.currentScore >= 70 && p.currentScore < 90).length, color: 'bg-yellow-500' },
                    { label: 'Concerning (<70%)', count: growthPerformances.filter(p => p.currentScore < 70).length, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${
                  insight.severity === 'critical' ? 'border-l-red-500' :
                  insight.severity === 'high' ? 'border-l-orange-500' :
                  insight.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'alert' ? 'bg-red-100 text-red-600' :
                        insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                        insight.type === 'suggestion' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {insight.type === 'alert' && <AlertTriangle className="h-4 w-4" />}
                        {insight.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        {insight.type === 'suggestion' && <TrendingUp className="h-4 w-4" />}
                        {insight.type === 'info' && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <div className="mt-2 p-2 bg-muted rounded-md">
                          <p className="text-sm font-medium">Action: {insight.action}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">All Good!</h3>
                  <p className="text-muted-foreground">
                    No critical growth issues detected. Keep monitoring your goats regularly.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface IndividualGoatAnalysisProps {
  goat: any;
  weightRecords: any[];
  performance?: any;
}

function IndividualGoatAnalysis({ goat, weightRecords, performance }: IndividualGoatAnalysisProps) {
  const ageMonths = GrowthAI.calculateAgeInMonths(goat.dateOfBirth);
  const expectedWeight = GrowthAI.getExpectedWeight(ageMonths, GrowthAI.DEFAULT_BREED_STANDARDS[goat.breed.toLowerCase()]);
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : 0;

  // Prepare chart data with breed standard
  const chartData = weightRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    actual: record.weight,
    expected: GrowthAI.getExpectedWeight(
      GrowthAI.calculateAgeInMonths(goat.dateOfBirth, new Date(record.date)),
      GrowthAI.DEFAULT_BREED_STANDARDS[goat.breed.toLowerCase()]
    )
  }));

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {performance?.currentScore || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Growth Performance Score</p>
              <div className="mt-2">
                <Progress value={Math.min(performance?.currentScore || 0, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {latestWeight} kg
              </div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="text-xs text-muted-foreground mt-1">
                Expected: {expectedWeight.toFixed(1)} kg
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {performance?.trend === 'improving' && <TrendingUp className="h-5 w-5 text-green-500" />}
                {performance?.trend === 'declining' && <TrendingDown className="h-5 w-5 text-red-500" />}
                {performance?.trend === 'stable' && <Activity className="h-5 w-5 text-blue-500" />}
                <span className="text-lg font-medium capitalize">
                  {performance?.trend || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Growth Trend</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Chart vs Breed Standard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Actual Weight"
                />
                <Line 
                  type="monotone" 
                  dataKey="expected" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                  name="Expected Weight"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {performance?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Growth Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
