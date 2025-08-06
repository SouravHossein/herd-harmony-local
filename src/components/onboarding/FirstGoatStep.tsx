
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/ImageUploader';
import EnhancedParentSelector from '@/components/EnhancedParentSelector';
import { Heart, User, Camera } from 'lucide-react';

interface FirstGoatStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (stepData: any) => void;
}

export function FirstGoatStep({ onNext, onBack, onData }: FirstGoatStepProps) {
  const [goatData, setGoatData] = useState({
    name: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    description: '',
    imageId: undefined as string | undefined,
    motherId: undefined as string | undefined,
    fatherId: undefined as string | undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!goatData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!goatData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }
    if (!goatData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!goatData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (file: File | null) => {
    setGoatData(prev => ({ ...prev, image: file }));
  };

  const handleParentSelect = (parentType: 'dam' | 'sire', parentId: string) => {
    setGoatData(prev => ({
      ...prev,
      [parentType === 'dam' ? 'damId' : 'sireId']: parentId
    }));
  };

  const handleNext = () => {
    if (validateForm()) {
      // Save goat data to localStorage for the onboarding process
      localStorage.setItem('onboarding-first-goat', JSON.stringify(goatData));
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setGoatData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold">Add Your First Goat</h2>
        <p className="text-muted-foreground">
          Let's start by adding your first goat to the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={goatData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter goat's name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="breed">Breed *</Label>
              <Select value={goatData.breed} onValueChange={(value) => handleInputChange('breed', value)}>
                <SelectTrigger className={errors.breed ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boer">Boer</SelectItem>
                  <SelectItem value="nubian">Nubian</SelectItem>
                  <SelectItem value="saanen">Saanen</SelectItem>
                  <SelectItem value="alpine">Alpine</SelectItem>
                  <SelectItem value="toggenburg">Toggenburg</SelectItem>
                  <SelectItem value="lamancha">LaMancha</SelectItem>
                  <SelectItem value="oberhasli">Oberhasli</SelectItem>
                  <SelectItem value="nigerian-dwarf">Nigerian Dwarf</SelectItem>
                  <SelectItem value="mixed">Mixed Breed</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.breed && <p className="text-xs text-destructive mt-1">{errors.breed}</p>}
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={goatData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={goatData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={errors.dateOfBirth ? 'border-destructive' : ''}
              />
              {errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={goatData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Any additional notes about this goat..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Photo & Parents (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Goat Photo</Label>
            <ImageUploader
              currentImageId={goatData.imageId}
              onImageChange={(imageId) => setGoatData(prev => ({ ...prev, imageId }))}
            />
          </div>

          <div>
            <Label>Parents</Label>
            <EnhancedParentSelector
              goats={[]} // We'll pass real goats from context later
              selectedMotherId={goatData.motherId}
              selectedFatherId={goatData.fatherId}
              onMotherChange={(id) => setGoatData(prev => ({ ...prev, motherId: id }))}
              onFatherChange={(id) => setGoatData(prev => ({ ...prev, fatherId: id }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
