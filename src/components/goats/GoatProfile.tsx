
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Weight, 
  Stethoscope, 
  Heart, 
  Timeline, 
  Camera,
  Edit,
  Star,
  Baby,
  MapPin,
  FileText
} from 'lucide-react';
import { Goat, WeightRecord, HealthRecord } from '@/types/goat';
import GoatGeneralInfo from './GoatGeneralInfo';
import GoatWeightHistory from './GoatWeightHistory';
import GoatHealthHistory from './GoatHealthHistory';
import GoatBreedingHistory from './GoatBreedingHistory';
import GoatTimeline from './GoatTimeline';
import GoatMediaGallery from './GoatMediaGallery';

interface GoatProfileProps {
  goat: Goat | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (goat: Goat) => void;
  weightRecords: WeightRecord[];
  healthRecords: HealthRecord[];
}

export default function GoatProfile({ 
  goat, 
  isOpen, 
  onClose, 
  onEdit, 
  weightRecords, 
  healthRecords 
}: GoatProfileProps) {
  const [activeTab, setActiveTab] = useState('general');

  if (!goat) return null;

  const calculateAge = (birthDate: Date): string => {
    const now = new Date();
    const ageMs = now.getTime() - birthDate.getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      return remainingMonths > 0 ? `${years} years ${remainingMonths} months` : `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
  };

  const goatWeightRecords = weightRecords.filter(w => w.goatId === goat.id);
  const goatHealthRecords = healthRecords.filter(h => h.goatId === goat.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {goat.mediaFiles?.find(m => m.type === 'image') ? (
                  <img
                    src={goat.mediaFiles.find(m => m.type === 'image')!.url}
                    alt={goat.name}
                    className="w-12 h-12 object-cover rounded-full border-2"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    {goat.gender === 'female' ? (
                      <Heart className="h-6 w-6 text-pink-500" />
                    ) : (
                      <User className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                )}
                {goat.isFavorite && (
                  <Star className="absolute -top-1 -right-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl flex items-center space-x-2">
                  <span>{goat.name}</span>
                  {goat.nickname && <span className="text-lg text-muted-foreground">"{goat.nickname}"</span>}
                </DialogTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>#{goat.tagNumber}</span>
                  <span>ID: {goat.id}</span>
                  <span>{calculateAge(goat.dateOfBirth)}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => onEdit(goat)} className="shrink-0">
              <Edit className="h-4 w-4 mr-2" />
              Edit Goat
            </Button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{goat.currentWeight || '--'}</p>
              <p className="text-xs text-muted-foreground">Current Weight (kg)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{goatHealthRecords.length}</p>
              <p className="text-xs text-muted-foreground">Health Records</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{goat.mediaFiles?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Media Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{goatWeightRecords.length}</p>
              <p className="text-xs text-muted-foreground">Weight Records</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center space-x-1">
              <Weight className="h-4 w-4" />
              <span className="hidden sm:inline">Weight</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-1">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger value="breeding" className="flex items-center space-x-1">
              <Baby className="h-4 w-4" />
              <span className="hidden sm:inline">Breeding</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center space-x-1">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center space-x-1">
              <Timeline className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="space-y-6">
              <GoatGeneralInfo goat={goat} />
            </TabsContent>

            <TabsContent value="weight" className="space-y-6">
              <GoatWeightHistory 
                goat={goat} 
                weightRecords={goatWeightRecords} 
              />
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <GoatHealthHistory 
                goat={goat} 
                healthRecords={goatHealthRecords} 
              />
            </TabsContent>

            <TabsContent value="breeding" className="space-y-6">
              <GoatBreedingHistory goat={goat} />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <GoatMediaGallery goat={goat} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <GoatTimeline 
                goat={goat} 
                weightRecords={goatWeightRecords}
                healthRecords={goatHealthRecords}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
