
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Users, Camera } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';

interface FirstGoatStepProps {
  onNext: () => void;
  onBack: () => void;
  onData: (data: any) => void;
}

export function FirstGoatStep({ onNext, onBack, onData }: FirstGoatStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    gender: '',
    tagNumber: '',
    dateOfBirth: '',
    color: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.breed && formData.gender) {
      onData({ firstGoat: formData });
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  const isValid = formData.name.trim() && formData.breed.trim() && formData.gender;

  return (
    <>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Add your first goat</CardTitle>
        <p className="text-muted-foreground">
          Let's create a record for one of your goats to get started
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Goat Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Luna"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagNumber" className="text-sm font-medium">
                Tag Number
              </Label>
              <Input
                id="tagNumber"
                placeholder="e.g., 001"
                value={formData.tagNumber}
                onChange={(e) => handleInputChange('tagNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="breed" className="text-sm font-medium">
                Breed *
              </Label>
              <Input
                id="breed"
                placeholder="e.g., Nubian"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm font-medium">
                Color/Markings
              </Label>
              <Input
                id="color"
                placeholder="e.g., Brown with white spots"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Photo (Optional)</span>
            </Label>
            <ImageUploader onImageUpload={handleImageUpload} />
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
