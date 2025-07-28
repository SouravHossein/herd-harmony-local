
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Heart, Weight, Calendar } from 'lucide-react';
import { formatDate, calculateAge } from '@/lib/utils';
import { Goat } from '@/types/goat';

interface PedigreeSidebarProps {
  goat: Goat | null;
  onClose: () => void;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeSidebar({ goat, onClose, onShowHealth, onShowWeight }: PedigreeSidebarProps) {
  if (!goat) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Goat Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{goat.name}</CardTitle>
              <div className="flex gap-2">
                <Badge className={getGenderColor(goat.gender)}>
                  {goat.gender === 'male' ? '♂ Male' : '♀ Female'}
                </Badge>
                <Badge className={getStatusColor(goat.status)}>
                  {goat.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Tag:</span>
                <div className="text-muted-foreground">#{goat.tagNumber}</div>
              </div>
              <div>
                <span className="font-medium">Breed:</span>
                <div className="text-muted-foreground">{goat.breed}</div>
              </div>
              <div>
                <span className="font-medium">Color:</span>
                <div className="text-muted-foreground">{goat.color}</div>
              </div>
              <div>
                <span className="font-medium">Horns:</span>
                <div className="text-muted-foreground">{goat.hornStatus}</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Birth Date:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(goat.dateOfBirth)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground ml-6">
                Age: {calculateAge(goat.dateOfBirth)}
              </div>
            </div>
            
            {goat.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <div className="text-sm text-muted-foreground mt-1">
                    {goat.notes}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onShowHealth(goat.id)}
            className="flex-1"
          >
            <Heart className="h-4 w-4 mr-2" />
            Health
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onShowWeight(goat.id)}
            className="flex-1"
          >
            <Weight className="h-4 w-4 mr-2" />
            Weight
          </Button>
        </div>
      </div>
    </div>
  );
}
