
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, X } from 'lucide-react';
import { useGoatContext } from '@/context/GoatContext';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: string;
  actionHandler?: () => void;
}

interface GettingStartedChecklistProps {
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export function GettingStartedChecklist({ onClose, onNavigate }: GettingStartedChecklistProps) {
  const { goats, weightRecords, healthRecords, financeRecords } = useGoatContext();
  const [dismissed, setDismissed] = useState(false);

  const checklistItems: ChecklistItem[] = [
    {
      id: 'add-goat',
      title: 'Add your first goat',
      description: 'Create a record for at least one goat in your herd',
      completed: goats.length > 0,
      action: 'Add Goat',
      actionHandler: () => onNavigate('goats')
    },
    {
      id: 'record-weight',
      title: 'Record a weight measurement',
      description: 'Track the weight of your goats for health monitoring',
      completed: weightRecords.length > 0,
      action: 'Add Weight',
      actionHandler: () => onNavigate('health')
    },
    {
      id: 'health-record',
      title: 'Create a health record',
      description: 'Log vaccinations, treatments, or health checkups',
      completed: healthRecords.length > 0,
      action: 'Add Health Record',
      actionHandler: () => onNavigate('health')
    },
    {
      id: 'financial-entry',
      title: 'Add a financial record',
      description: 'Track income and expenses related to your farm',
      completed: financeRecords.length > 0,
      action: 'Add Transaction',
      actionHandler: () => onNavigate('finance')
    },
    {
      id: 'explore-features',
      title: 'Explore advanced features',
      description: 'Check out breeding records, pedigree tracking, and analytics',
      completed: false, // This is manually completed by user
      action: 'Explore',
      actionHandler: () => onNavigate('pedigree')
    }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  if (dismissed || completedCount === checklistItems.length) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete these steps to get the most out of Herd Harmony
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {completedCount} of {checklistItems.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              item.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-background hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              
              <div>
                <h4 className={`font-medium ${item.completed ? 'text-green-800' : ''}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            
            {!item.completed && item.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={item.actionHandler}
                className="flex items-center space-x-1"
              >
                <span>{item.action}</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}
        
        {completedCount === checklistItems.length && (
          <div className="text-center py-4">
            <div className="text-green-600 font-medium mb-2">🎉 Congratulations!</div>
            <p className="text-sm text-muted-foreground">
              You've completed the getting started checklist. You're ready to manage your farm like a pro!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
