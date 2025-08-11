
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Edit, 
  Trash2, 
  Eye, 
  Scale, 
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Baby
} from 'lucide-react';
import { Goat } from '@/types/goat';

interface GoatCardProps {
  goat: Goat;
  onView: (goat: Goat) => void;
  onEdit: (goat: Goat) => void;
  onDelete: (goat: Goat) => void;
  onQuickWeight: (goat: Goat) => void;
  onQuickHealth: (goat: Goat) => void;
  onToggleFavorite: (goat: Goat) => void;
}

export default function GoatCard({ 
  goat, 
  onView, 
  onEdit, 
  onDelete, 
  onQuickWeight, 
  onQuickHealth,
  onToggleFavorite 
}: GoatCardProps) {
  const calculateAge = (birthDate: Date): string => {
    const now = new Date();
    console.log('Calculating age for:', birthDate);
    const ageMs = now.getTime() - new Date(birthDate).getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years}y`;
    }
    return `${ageMonths}m`;
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'treatment': return 'bg-yellow-100 text-yellow-800';
      case 'checkup_due': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreedingStatusColor = (status: string) => {
    switch (status) {
      case 'pregnant': return 'bg-purple-100 text-purple-800';
      case 'lactating': return 'bg-blue-100 text-blue-800';
      case 'kid': return 'bg-pink-100 text-pink-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const primaryImage = goat.mediaFiles?.find(m => m.type === 'image') || 
                      (goat.photoPath ? { url: goat.photoPath } : null);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group relative">
      {/* Favorite Star */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onToggleFavorite(goat)}
      >
        <Star className={`h-4 w-4 ${goat.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
      </Button>

      <CardContent className="p-4 space-y-3">
        {/* Header with Image and Basic Info */}
        <div className="flex items-start space-x-3">
          <div className="relative">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={goat.name}
                className="w-16 h-16 object-cover rounded-full border-2 border-border"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                {goat.gender === 'female' ? (
                  <Heart className="h-8 w-8 text-pink-500" />
                ) : (
                  <Activity className="h-8 w-8 text-blue-500" />
                )}
              </div>
            )}
            {goat.isFavorite && (
              <Star className="absolute -top-1 -right-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{goat.name}</h3>
              <div className="flex items-center space-x-1">
                {goat.gender === 'female' ? (
                  <Heart className="h-4 w-4 text-pink-500" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>#{goat.tagNumber}</p>
              {goat.nickname && <p>"{goat.nickname}"</p>}
              <p>ID: {goat.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Age</p>
            <p className="font-medium">{calculateAge(goat.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="font-medium">{goat.currentWeight || '--'} kg</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge className={getHealthStatusColor('healthy')}>
            Healthy
          </Badge>
          <Badge className={getBreedingStatusColor(goat.breedingStatus)}>
            {goat.breedingStatus}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {goat.breed}
          </Badge>
        </div>

        {/* Custom Tags */}
        {goat.tags && goat.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goat.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {goat.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{goat.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-1 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(goat)}
            className="flex-1"
          >
            <Eye className="h-3 w-3 mr-1" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuickWeight(goat)}
            title="Add Weight"
          >
            <Scale className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuickHealth(goat)}
            title="Add Health Record"
          >
            <Stethoscope className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goat)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        {/* Additional Info Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Born {new Date(goat.dateOfBirth).toLocaleDateString()}</span>
          </div>
          {(goat.fatherId || goat.motherId) && (
            <div className="flex items-center space-x-1">
              <Baby className="h-3 w-3" />
              <span>Parents known</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
