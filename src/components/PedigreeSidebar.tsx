
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Weight, Calendar, Info } from 'lucide-react';
import { Goat } from '@/types/goat';
import { calculateAge } from '@/lib/utils';

interface PedigreeSidebarProps {
  goat: Goat | null;
  onShowHealth: (goatId: string) => void;
  onShowWeight: (goatId: string) => void;
}

export function PedigreeSidebar({ goat, onShowHealth, onShowWeight }: PedigreeSidebarProps) {
  if (!goat) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg">Goat Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a goat from the tree to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const getGenderColor = (gender: string) => {
    return gender === 'male' ? 'bg-blue-500' : 'bg-pink-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'sold': return 'bg-yellow-500';
      case 'deceased': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{goat.name}</span>
          <div className="flex gap-2">
            <Badge className={`${getGenderColor(goat.gender)} text-white`}>
              {goat.gender}
            </Badge>
            <Badge className={`${getStatusColor(goat.status)} text-white`}>
              {goat.status}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tag Number:</span>
            <span className="text-sm text-muted-foreground">#{goat.tagNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Breed:</span>
            <span className="text-sm text-muted-foreground">{goat.breed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Color:</span>
            <span className="text-sm text-muted-foreground">{goat.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Horn Status:</span>
            <span className="text-sm text-muted-foreground">{goat.hornStatus}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date of Birth:</span>
            <span className="text-sm text-muted-foreground">
              {new Date(goat.dateOfBirth).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Age:</span>
            <span className="text-sm text-muted-foreground">
              {calculateAge(goat.dateOfBirth)}
            </span>
          </div>
        </div>

        <Separator />

        {goat.notes && (
          <>
            <div>
              <span className="text-sm font-medium">Notes:</span>
              <p className="text-sm text-muted-foreground mt-1">{goat.notes}</p>
            </div>
            <Separator />
          </>
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => onShowHealth(goat.id)}
            className="w-full"
          >
            <Heart className="h-4 w-4 mr-2" />
            View Health Records
          </Button>
          <Button
            variant="outline"
            onClick={() => onShowWeight(goat.id)}
            className="w-full"
          >
            <Weight className="h-4 w-4 mr-2" />
            View Weight Records
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
