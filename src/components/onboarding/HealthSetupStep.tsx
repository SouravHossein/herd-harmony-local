
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Heart, Bell } from 'lucide-react';

interface HealthSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (data: any) => void;
}

const HEALTH_OPTIONS = [
  { id: 'vaccinations', label: 'Vaccination Reminders', description: 'Get notified about upcoming vaccinations' },
  { id: 'deworming', label: 'Deworming Schedule', description: 'Track and schedule deworming treatments' },
  { id: 'weight', label: 'Weight Tracking', description: 'Regular weight monitoring reminders' },
  { id: 'breeding', label: 'Breeding Health', description: 'Monitor reproductive health and cycles' },
  { id: 'hoof', label: 'Hoof Care', description: 'Schedule regular hoof trimming and care' },
  { id: 'general', label: 'General Health Checks', description: 'Regular overall health assessments' }
];

export function HealthSetupStep({ onNext, onBack, onData }: HealthSetupStepProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['vaccinations', 'weight']);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onData({ 
      healthSetup: { 
        selectedOptions,
        enableNotifications 
      } 
    });
    onNext();
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Set up health tracking</CardTitle>
        <p className="text-muted-foreground">
          Choose which health aspects you'd like to monitor and get reminders for
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <Checkbox
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-primary" />
                <Label htmlFor="notifications" className="font-medium">
                  Enable Smart Notifications
                </Label>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pl-4">
              We'll send you reminders for important health tasks and overdue activities
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Health Monitoring Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HEALTH_OPTIONS.map((option) => (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                    <Checkbox
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={() => toggleOption(option.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button type="submit">
              Complete Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
