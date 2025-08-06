
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Heart, Bell, Calendar } from 'lucide-react';

interface HealthSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (data: any) => void;
}

export function HealthSetupStep({ onNext, onBack, onData }: HealthSetupStepProps) {
  const [preferences, setPreferences] = useState({
    enableReminders: true,
    vaccinationAlerts: true,
    weightTracking: true,
    breedingReminders: true,
    healthCheckFrequency: 'monthly'
  });

  const handleCheckboxChange = (field: string) => (checked: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: checked }));
  };

  const handleNext = () => {
    onData({ healthPreferences: preferences });
    onNext();
  };

  const features = [
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get alerts for overdue vaccinations, health checks, and important reminders',
      enabled: preferences.enableReminders,
      field: 'enableReminders'
    },
    {
      icon: Heart,
      title: 'Vaccination Tracking',
      description: 'Track vaccinations and get reminded when boosters are due',
      enabled: preferences.vaccinationAlerts,
      field: 'vaccinationAlerts'
    },
    {
      icon: Calendar,
      title: 'Weight Monitoring',
      description: 'Regular weight tracking with growth analysis and alerts',
      enabled: preferences.weightTracking,
      field: 'weightTracking'
    }
  ];

  return (
    <CardContent className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span>Health Tracking Setup</span>
        </CardTitle>
        <p className="text-muted-foreground">
          Configure how Herd Harmony will help you maintain your goats' health and wellbeing.
        </p>
      </CardHeader>

      <div className="space-y-4">
        <h3 className="font-semibold">Enable Health Features</h3>
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary mt-1" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{feature.title}</h4>
                  <Badge variant={feature.enabled ? "default" : "secondary"}>
                    {feature.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox
                    id={feature.field}
                    checked={feature.enabled}
                    onCheckedChange={handleCheckboxChange(feature.field)}
                  />
                  <Label htmlFor={feature.field} className="text-sm">
                    Enable {feature.title}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Why Health Tracking Matters</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Prevents missed vaccinations and health checks</li>
          <li>• Early detection of health issues through weight monitoring</li>
          <li>• Better breeding decisions based on health records</li>
          <li>• Improved herd performance and productivity</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  );
}
