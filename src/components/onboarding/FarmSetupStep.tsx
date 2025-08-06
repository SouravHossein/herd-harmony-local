
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, MapPin, Home } from 'lucide-react';

interface FarmSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (data: any) => void;
}

export function FarmSetupStep({ onNext, onBack, onData }: FarmSetupStepProps) {
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    description: '',
    totalAcres: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.farmName && formData.location) {
      onData({ farmSetup: formData });
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = formData.farmName.trim() && formData.location.trim();

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Tell us about your farm</CardTitle>
        <p className="text-muted-foreground">
          This helps us personalize your experience and generate better insights
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="farmName" className="text-sm font-medium">
                Farm Name *
              </Label>
              <Input
                id="farmName"
                placeholder="e.g., Sunset Valley Farm"
                value={formData.farmName}
                onChange={(e) => handleInputChange('farmName', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Texas, USA"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAcres" className="text-sm font-medium">
              Total Acreage (Optional)
            </Label>
            <Input
              id="totalAcres"
              type="number"
              placeholder="e.g., 25"
              value={formData.totalAcres}
              onChange={(e) => handleInputChange('totalAcres', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Farm Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your farming goals, specialties, or anything else you'd like to share..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button type="submit" disabled={!isValid}>
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
