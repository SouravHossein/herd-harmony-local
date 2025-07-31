
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export default function WeatherWidget() {
  return (
    <Card className="w-48">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Weather</p>
            <p className="text-xs text-muted-foreground">Local conditions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
