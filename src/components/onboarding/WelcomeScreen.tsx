
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, TrendingUp, Shield, ArrowRight, X } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const FEATURES = [
  {
    icon: Users,
    title: 'Complete Goat Management',
    description: 'Track all your goats with photos, pedigrees, and detailed records'
  },
  {
    icon: Heart,
    title: 'Health Monitoring',
    description: 'Never miss vaccinations or treatments with smart reminders'
  },
  {
    icon: TrendingUp,
    title: 'Growth Tracking',
    description: 'Monitor weight gain and performance metrics over time'
  },
  {
    icon: Shield,
    title: 'Breeding Intelligence',
    description: 'Optimize breeding decisions with genetic analysis and planning'
  }
];

export function WelcomeScreen({ onNext, onSkip }: WelcomeScreenProps) {
  return (
    <>
      <CardHeader className="text-center relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0"
          onClick={onSkip}
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        
        <CardTitle className="text-3xl">Welcome to Herd Harmony!</CardTitle>
        <p className="text-lg text-muted-foreground mt-2">
          Your complete goat farm management solution
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Let's get your farm set up in just a few minutes!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onNext} size="lg" className="flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" onClick={onSkip}>
              Skip Setup (I'll do it later)
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
