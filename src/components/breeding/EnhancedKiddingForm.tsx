
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Users } from "lucide-react";
import { BreedingRecord } from '@/types/breeding';
import { Goat } from '@/types/goat';
import { useGoatContext } from '@/context/GoatContext';

interface EnhancedKiddingFormProps {
  breedingRecords: BreedingRecord[];
  onSubmit: (data: {
    breedingId: string;
    birthDate: Date;
    totalKids: number;
    kidDetails: Array<{
      id: string;
      name: string;
      gender: 'male' | 'female';
      birthWeight: number;
      status: 'alive' | 'deceased' | 'weak';
      photos?: string[];
      notes?: string;
    }>;
    complications?: string;
    vetAssistance: boolean;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export default function EnhancedKiddingForm({ 
  breedingRecords, 
  onSubmit, 
  onCancel 
}: EnhancedKiddingFormProps) {
  const { goats } = useGoatContext();
  const [selectedBreeding, setSelectedBreeding] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalKids, setTotalKids] = useState(1);
  const [kidDetails, setKidDetails] = useState([
    { 
      id: '1', 
      name: '', 
      gender: 'male' as const, 
      birthWeight: 0, 
      status: 'alive' as const, 
      photos: [] as string[],
      notes: '' 
    }
  ]);
  const [complications, setComplications] = useState('');
  const [vetAssistance, setVetAssistance] = useState(false);
  const [notes, setNotes] = useState('');

  const selectedBreedingRecord = breedingRecords.find(br => br.id === selectedBreeding);
  const sire = selectedBreedingRecord ? goats.find(g => g.id === selectedBreedingRecord.sireId) : null;
  const dam = selectedBreedingRecord ? goats.find(g => g.id === selectedBreedingRecord.damId) : null;

  const handleKidCountChange = (count: number) => {
    setTotalKids(count);
    const newKidDetails = [];
    for (let i = 0; i < count; i++) {
      newKidDetails.push(
        kidDetails[i] || {
          id: (i + 1).toString(),
          name: '',
          gender: 'male' as const,
          birthWeight: 0,
          status: 'alive' as const,
          photos: [],
          notes: ''
        }
      );
    }
    setKidDetails(newKidDetails);
  };

  const updateKidDetail = (index: number, field: string, value: any) => {
    const updated = [...kidDetails];
    updated[index] = { ...updated[index], [field]: value };
    setKidDetails(updated);
  };

  const handlePhotoUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const photoUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        try {
          // Convert to base64 for local storage
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              photoUrls.push(e.target.result as string);
              if (photoUrls.length === files.length) {
                const currentPhotos = kidDetails[index].photos || [];
                updateKidDetail(index, 'photos', [...currentPhotos, ...photoUrls]);
              }
            }
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error uploading photo:', error);
        }
      }
    }
  };

  const removePhoto = (kidIndex: number, photoIndex: number) => {
    const kid = kidDetails[kidIndex];
    const updatedPhotos = kid.photos?.filter((_, index) => index !== photoIndex) || [];
    updateKidDetail(kidIndex, 'photos', updatedPhotos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBreeding) return;

    onSubmit({
      breedingId: selectedBreeding,
      birthDate: new Date(birthDate),
      totalKids,
      kidDetails: kidDetails.map(kid => ({
        ...kid,
        photos: kid.photos || []
      })),
      complications: complications || undefined,
      vetAssistance,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Record Kidding with Photos</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Breeding Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Breeding Record</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBreeding} onValueChange={setSelectedBreeding}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a breeding record" />
                </SelectTrigger>
                <SelectContent>
                  {breedingRecords.map((breeding) => (
                    <SelectItem key={breeding.id} value={breeding.id}>
                      <div className="flex items-center space-x-2">
                        <span>Breeding {new Date(breeding.breedingDate).toLocaleDateString()}</span>
                        {breeding.pregnancyStatus === 'confirmed' && (
                          <Badge variant="default">Confirmed</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedBreedingRecord && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        <strong>Sire:</strong> {sire?.name || 'Unknown'} × <strong>Dam:</strong> {dam?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalKids">Number of Kids</Label>
              <Input
                id="totalKids"
                type="number"
                min="1"
                max="5"
                value={totalKids}
                onChange={(e) => handleKidCountChange(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Kid Details */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Kid Details</Label>
            {kidDetails.map((kid, index) => (
              <Card key={kid.id}>
                <CardHeader>
                  <CardTitle className="text-base">Kid {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={kid.name}
                        onChange={(e) => updateKidDetail(index, 'name', e.target.value)}
                        placeholder="Kid name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`gender-${index}`}>Gender</Label>
                      <Select value={kid.gender} onValueChange={(value) => updateKidDetail(index, 'gender', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`weight-${index}`}>Birth Weight (kg)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        step="0.1"
                        value={kid.birthWeight}
                        onChange={(e) => updateKidDetail(index, 'birthWeight', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`status-${index}`}>Status</Label>
                      <Select value={kid.status} onValueChange={(value) => updateKidDetail(index, 'status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alive">Alive</SelectItem>
                          <SelectItem value="deceased">Deceased</SelectItem>
                          <SelectItem value="weak">Weak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <Label className="flex items-center space-x-2 mb-2">
                      <Camera className="w-4 h-4" />
                      <span>Photos</span>
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Add Photos
                        </Button>
                        <input
                          id={`photo-upload-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(index, e)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {kid.photos?.length || 0} photos
                        </span>
                      </div>
                      
                      {kid.photos && kid.photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {kid.photos.map((photo, photoIndex) => (
                            <div key={photoIndex} className="relative">
                              <img
                                src={photo}
                                alt={`Kid ${index + 1} photo ${photoIndex + 1}`}
                                className="w-full aspect-square object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removePhoto(index, photoIndex)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Textarea
                      id={`notes-${index}`}
                      value={kid.notes}
                      onChange={(e) => updateKidDetail(index, 'notes', e.target.value)}
                      placeholder="Additional notes for this kid..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="complications">Complications</Label>
              <Textarea
                id="complications"
                value={complications}
                onChange={(e) => setComplications(e.target.value)}
                placeholder="Any complications during birth..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="vetAssistance"
                checked={vetAssistance}
                onCheckedChange={(checked) => setVetAssistance(checked === true)}
              />
              <Label htmlFor="vetAssistance">Veterinary assistance required</Label>
            </div>

            <div>
              <Label htmlFor="notes">General Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="General notes about the kidding..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedBreeding}>
              Record Kidding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
