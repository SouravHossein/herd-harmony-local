
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/ImageUploader';
import { EnhancedParentSelector } from '@/components/EnhancedParentSelector';
import { useGoatContext } from '@/context/GoatContext';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

interface FirstGoatStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (data: any) => void;
}

export function FirstGoatStep({ onNext, onBack, onData }: FirstGoatStepProps) {
  const { addGoat, goats } = useGoatContext();
  const [goatData, setGoatData] = useState({
    name: '',
    breed: '',
    tagNumber: '',
    gender: 'female' as const,
    dateOfBirth: '',
    color: '',
    notes: '',
    fatherId: '',
    motherId: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setGoatData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!goatData.name || !goatData.breed || !goatData.tagNumber || !goatData.dateOfBirth) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const newGoat = await addGoat({
        ...goatData,
        dateOfBirth: new Date(goatData.dateOfBirth),
        status: 'active',
        hornStatus: 'horned',
        mediaFiles: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      onData({ goatData: newGoat });
      onNext();
    } catch (error) {
      console.error('Error adding goat:', error);
      alert('Failed to add goat. Please try again.');
    }
  };

  return (
    <CardContent className="space-y-6">
      <CardHeader>
        <CardTitle>Add Your First Goat</CardTitle>
        <p className="text-muted-foreground">
          Let's start by adding a goat to your herd. This will help you understand how the system works.
        </p>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Goat Name *</Label>
          <Input
            id="name"
            value={goatData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Luna"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Breed *</Label>
          <Input
            id="breed"
            value={goatData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            placeholder="e.g., Nubian"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagNumber">Tag Number *</Label>
          <Input
            id="tagNumber"
            value={goatData.tagNumber}
            onChange={(e) => handleInputChange('tagNumber', e.target.value)}
            placeholder="e.g., 001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={goatData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={goatData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={goatData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            placeholder="e.g., Brown and white"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Goat Photo</Label>
          <ImageUploader
            onImageSelected={(file) => {
              // Handle image upload
              console.log('Image selected:', file);
            }}
          />
        </div>

        {goats.length > 0 && (
          <div className="space-y-4">
            <EnhancedParentSelector
              goats={goats}
              selectedSire={goatData.fatherId}
              selectedDam={goatData.motherId}
              onSireChange={(id) => handleInputChange('fatherId', id || '')}
              onDamChange={(id) => handleInputChange('motherId', id || '')}
              allowUnknown={true}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={goatData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any additional notes about this goat..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goat & Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  );
}
