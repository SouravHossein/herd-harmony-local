
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { WelcomeScreen } from './WelcomeScreen';
import { FarmSetupStep } from './FarmSetupStep';
import { FirstGoatStep } from './FirstGoatStep';
import { HealthSetupStep } from './HealthSetupStep';
import { CompletionStep } from './CompletionStep';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with Herd Harmony' },
  { id: 'farm-setup', title: 'Farm Setup', description: 'Configure your farm details' },
  { id: 'first-goat', title: 'Add Your First Goat', description: 'Create your first goat record' },
  { id: 'health-setup', title: 'Health Tracking', description: 'Set up health monitoring' },
  { id: 'completion', title: 'All Set!', description: 'Your farm is ready to manage' }
];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    goatData: null,
    healthPreferences: {}
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={handleNext} onSkip={onSkip} />;
      case 1:
        return <FarmSetupStep onNext={handleNext} onBack={handleBack} onData={handleStepData} />;
      case 2:
        return <FirstGoatStep onNext={handleNext} onBack={handleBack} onData={handleStepData} />;
      case 3:
        return <HealthSetupStep onNext={handleNext} onBack={handleBack} onData={handleStepData} />;
      case 4:
        return <CompletionStep onComplete={onComplete} farmData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Herd Harmony Setup</h1>
            </div>
            <Badge variant="outline">{currentStep + 1} of {STEPS.length}</Badge>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className="flex items-center">
                  {completedSteps.has(index) ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : index === currentStep ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="min-h-[500px]">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
}
