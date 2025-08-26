
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, User, Calendar, Tag, Eye, Edit, Star } from 'lucide-react';
import { Goat } from '@/types/goat';

interface PedigreeGoatCardProps {
  goat: Goat;
  onView?: (goat: Goat) => void;
  onEdit?: (goat: Goat) => void;
  showActions?: boolean;
  className?: string;
}

export function PedigreeGoatCard({ 
  goat, 
  onView, 
  onEdit, 
  showActions = true, 
  className = '' 
}: PedigreeGoatCardProps) {
  const calculateAge = (birthDate: Date): string => {
    const now = new Date();
    const ageMs = now.getTime() - new Date(birthDate).getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years}y`;
    }
    return `${ageMonths}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'sold': return 'bg-blue-500';
      case 'deceased': return 'bg-red-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'female' ? Heart : User;
  };

  const GenderIcon = getGenderIcon(goat.gender);

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              {goat.mediaFiles?.find(m => m.type === 'image') ? (
                <img
                  src={goat.mediaFiles.find(m => m.type === 'image')!.url}
                  alt={goat.name}
                  className="w-10 h-10 object-cover rounded-full border-2 border-primary"
                />
              ) : (
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <GenderIcon className="h-5 w-5 text-primary" />
                </div>
              )}
              {goat.isFavorite && (
                <Star className="absolute -top-1 -right-1 h-3 w-3 fill-primary text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{goat.name}</h3>
              {goat.nickname && (
                <p className="text-sm text-muted-foreground italic">"{goat.nickname}"</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(goat.status)} text-white text-xs`}
            >
              {goat.status}
            </Badge>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center space-x-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">#{goat.tagNumber}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{calculateAge(goat.dateOfBirth)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">{goat.breed}</span>
          </div>
        </div>

        {/* Breeding Status for females */}
        {goat.gender === 'female' && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {goat.breedingStatus}
            </Badge>
          </div>
        )}

        {/* Weight Info */}
        {goat.currentWeight && (
          <div className="mb-3">
            <p className="text-sm">
              <span className="text-muted-foreground">Weight:</span> {goat.currentWeight} kg
            </p>
          </div>
        )}

        {/* Tags */}
        {goat.tags && goat.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {goat.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {goat.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{goat.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Notes (truncated) */}
        {goat.notes && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground italic">
              {goat.notes.length > 60 
                ? `${goat.notes.substring(0, 60)}...` 
                : goat.notes
              }
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (onView || onEdit) && (
          <div className="flex space-x-2 pt-3 border-t border-border">
            {onView && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(goat)}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(goat)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Default export for backward compatibility
export default PedigreeGoatCard;
