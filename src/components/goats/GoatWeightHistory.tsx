
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Weight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Goat, WeightRecord } from '@/types/goat';

interface GoatWeightHistoryProps {
  goat: Goat;
  weightRecords: WeightRecord[];
}

export default function GoatWeightHistory({ goat, weightRecords }: GoatWeightHistoryProps) {
  const sortedRecords = weightRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = sortedRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    weight: record.weight,
    fullDate: record.date
  }));

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Weight className="h-5 w-5" />
            <span>Weight Growth Chart</span>
            <Badge variant="outline">{sortedRecords.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRecords.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    fontSize={12}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} kg`, 'Weight']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Weight className="h-12 w-12 mb-4 opacity-50" />
              <p>Not enough weight records to show chart</p>
              <p className="text-sm">Add more weight records to see growth trends</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRecords.length > 0 ? (
            <div className="space-y-3">
              {sortedRecords.slice().reverse().map((record, index) => {
                const previousRecord = sortedRecords[sortedRecords.length - index - 2];
                const weightChange = previousRecord ? record.weight - previousRecord.weight : 0;

                return (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-semibold">{record.weight} kg</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {previousRecord && (
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(record.weight, previousRecord.weight)}
                            <span className={`text-sm font-medium ${getTrendColor(record.weight, previousRecord.weight)}`}>
                              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-1 italic">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Weight className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No weight records found</p>
              <p className="text-sm">Start tracking {goat.name}'s weight to monitor growth</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
