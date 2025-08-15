
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Heart, 
  Activity, 
  Calendar, 
  Star,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Goat } from '@/types/goat';
import { useImageStorage } from '@/hooks/useImageStorage';

interface PedigreeGoatCardProps {
  goat: Goat;
  level: number;
  isFocused?: boolean;
  onClick?: () => void;
  isFoundation?: boolean;
}

export default function PedigreeGoatCard({ 
  goat, 
  level, 
  isFocused = false, 
  onClick,
  isFoundation = false 
}: PedigreeGoatCardProps) {
  const { getImage } = useImageStorage();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (goat.imageId) {
      getImage(goat.imageId).then(url => {
        if (url) setImageUrl(url);
      }).catch(() => {
        setImageUrl(null);
      });
    }
  }, [goat.imageId, getImage]);

  const calculateAge = (birthDate: Date): string => {
    const now = new Date();
    const ageMs = now.getTime() - (new Date(birthDate)).getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      return `${years}y`;
    }
    return `${ageMonths}m`;
  };

  const getGenerationLabel = (level: number) => {
    if (level === 0) return isFoundation ? 'Foundation' : 'F0';
    return `F${level}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreedingStatusIcon = (status: string) => {
    switch (status) {
      case 'pregnant': return <Heart className="h-3 w-3 text-pink-500" />;
      case 'lactating': return <Activity className="h-3 w-3 text-blue-500" />;
      case 'active': return <Star className="h-3 w-3 text-green-500" />;
      default: return null;
    }
  };

  return (
    <Card 
      className={`
        transition-all duration-200 cursor-pointer hover:shadow-md
        ${isFocused ? 'ring-2 ring-primary shadow-lg' : ''}
        ${isFoundation ? 'border-primary border-2' : ''}
        ${level === 0 ? 'bg-gradient-to-r from-primary/5 to-primary/10' : ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          {/* Goat Image */}
          <div className="flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={goat.name}
                className="w-12 h-12 object-cover rounded-full border-2 border-background shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                {goat.gender === 'female' ? (
                  <Heart className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <Crown className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            )}
          </div>

          {/* Goat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{goat.name}</h4>
              {goat.isFavorite && <Star className="h-3 w-3 fill-primary text-primary" />}
              {isFoundation && <Crown className="h-3 w-3 text-primary" />}
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                #{goat.tagNumber}
              </Badge>
              <Badge variant={goat.gender === 'male' ? 'default' : 'secondary'} className="text-xs">
                {goat.gender === 'male' ? '♂' : '♀'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getGenerationLabel(level)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{calculateAge(goat.dateOfBirth)}</span>
              </div>
              <div className="flex items-center space-x-1">
                {getBreedingStatusIcon(goat.breedingStatus)}
                <span className="truncate">{goat.breedingStatus}</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <Badge className={`text-xs ${getStatusColor(goat.status)}`}>
                {goat.status}
              </Badge>
              <span className="text-xs text-muted-foreground truncate">
                {goat.breed}
              </span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex flex-col space-y-1">
            {goat.notes && (
              <Info className="h-3 w-3 text-muted-foreground" title="Has notes" />
            )}
            {goat.currentWeight && goat.currentWeight < 20 && (
              <AlertTriangle className="h-3 w-3 text-yellow-500" title="Low weight" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
