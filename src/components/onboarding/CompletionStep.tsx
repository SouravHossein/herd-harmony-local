
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
  farmData: any;
}

export function CompletionStep({ onComplete, farmData }: CompletionStepProps) {
  const completedTasks = [
    'Farm profile created',
    'First goat added',
    'Health monitoring configured',
    'Smart notifications enabled'
  ];

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-3xl">🎉 You're all set!</CardTitle>
        <p className="text-lg text-muted-foreground">
          Welcome to your intelligent farm management system
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Setup Complete</span>
          </h3>
          
          <div className="space-y-3">
            {completedTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium">Add More Goats</h4>
              <p className="text-sm text-muted-foreground">Continue building your herd records</p>
              <Badge variant="secondary" className="mt-2">Recommended</Badge>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium">Schedule Health Tasks</h4>
              <p className="text-sm text-muted-foreground">Set up vaccination and care schedules</p>
              <Badge variant="secondary" className="mt-2">Important</Badge>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium">Record Weights</h4>
              <p className="text-sm text-muted-foreground">Start tracking growth and performance</p>
              <Badge variant="outline" className="mt-2">Optional</Badge>
            </div>
            
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium">Explore Features</h4>
              <p className="text-sm text-muted-foreground">Discover breeding, finance, and analytics</p>
              <Badge variant="outline" className="mt-2">Optional</Badge>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <Button onClick={onComplete} size="lg" className="px-8">
            Enter Farm Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            You can always access these settings later in the Settings tab
          </p>
        </div>
      </CardContent>
    </>
  );
}
