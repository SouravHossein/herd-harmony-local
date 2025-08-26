
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  User, 
  Calendar, 
  Weight, 
  Star, 
  Eye,
  Baby,
  Activity,
  AlertCircle
} from 'lucide-react';
import { Goat } from '@/types/goat';
import { formatDate, calculateAge } from '@/lib/utils';

interface PedigreeGoatCardProps {
  goat: Goat;
  onViewDetails: (goat: Goat) => void;
  onSelectAsParent?: (goat: Goat) => void;
  showSelectButton?: boolean;
  compact?: boolean;
}

export function PedigreeGoatCard({ 
  goat, 
  onViewDetails, 
  onSelectAsParent, 
  showSelectButton = false,
  compact = false 
}: PedigreeGoatCardProps) {
  const age = calculateAge(goat.dateOfBirth);
  
  const getGenderIcon = (gender: string) => {
    return gender === 'female' ? 
      <Heart className="h-4 w-4 text-pink-500" /> : 
      <User className="h-4 w-4 text-blue-500" />;
  };

  const getGenderColor = (gender: string) => {
    return gender === 'female' ? 'border-pink-200 bg-pink-50' : 'border-blue-200 bg-blue-50';
  };

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow cursor-pointer ${getGenderColor(goat.gender)}`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              {goat.mediaFiles?.find(m => m.type === 'image') ? (
                <AvatarImage 
                  src={goat.mediaFiles.find(m => m.type === 'image')!.url} 
                  alt={goat.name} 
                />
              ) : (
                <AvatarFallback>
                  {getGenderIcon(goat.gender)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm truncate">{goat.name}</h4>
                {goat.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="text-xs text-muted-foreground">#{goat.tagNumber}</p>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(goat);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${getGenderColor(goat.gender)}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                {goat.mediaFiles?.find(m => m.type === 'image') ? (
                  <AvatarImage 
                    src={goat.mediaFiles.find(m => m.type === 'image')!.url} 
                    alt={goat.name} 
                  />
                ) : (
                  <AvatarFallback>
                    {getGenderIcon(goat.gender)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">{goat.name}</h3>
                  {goat.isFavorite && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">#{goat.tagNumber}</p>
                {goat.nickname && (
                  <p className="text-sm italic text-muted-foreground">"{goat.nickname}"</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              <Badge variant={goat.gender === 'female' ? 'default' : 'secondary'}>
                <span className="flex items-center space-x-1">
                  {getGenderIcon(goat.gender)}
                  <span className="capitalize">{goat.gender}</span>
                </span>
              </Badge>
              
              {goat.isActive === false && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{age}</span>
            </div>
            
            {goat.currentWeight && (
              <div className="flex items-center space-x-2">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <span>{goat.currentWeight} kg</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Baby className="h-4 w-4 text-muted-foreground" />
              <span>{goat.breed}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className={goat.isActive !== false ? 'text-green-600' : 'text-gray-500'}>
                {goat.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Family Info */}
          {(goat.motherId || goat.fatherId) && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Family</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                {goat.motherId && (
                  <p>Mother: ID {goat.motherId}</p>
                )}
                {goat.fatherId && (
                  <p>Father: ID {goat.fatherId}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onViewDetails(goat)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            
            {showSelectButton && onSelectAsParent && (
              <Button 
                size="sm" 
                onClick={() => onSelectAsParent(goat)}
                className="flex-1"
              >
                Select as Parent
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
