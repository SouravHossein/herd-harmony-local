
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Heart, Calendar, User } from 'lucide-react';
import { Goat } from '@/types/goat';

interface GoatBreedingHistoryProps {
  goat: Goat;
}

export default function GoatBreedingHistory({ goat }: GoatBreedingHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Breeding Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Current Breeding Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={
                goat.breedingStatus === 'pregnant' ? 'bg-purple-100 text-purple-800' :
                goat.breedingStatus === 'lactating' ? 'bg-blue-100 text-blue-800' :
                goat.breedingStatus === 'kid' ? 'bg-pink-100 text-pink-800' :
                goat.breedingStatus === 'active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }>
                {goat.breedingStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{goat.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parentage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Parentage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Father (Sire)</p>
              {goat.fatherId ? (
                <div className="flex items-center space-x-2">
                  <p className="font-medium">ID: {goat.fatherId}</p>
                  <Badge variant="outline">Known</Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-muted-foreground">Unknown</p>
                  <Badge variant="secondary">Missing</Badge>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mother (Dam)</p>
              {goat.motherId ? (
                <div className="flex items-center space-x-2">
                  <p className="font-medium">ID: {goat.motherId}</p>
                  <Badge variant="outline">Known</Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-muted-foreground">Unknown</p>
                  <Badge variant="secondary">Missing</Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breeding History Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Baby className="h-5 w-5" />
            <span>Breeding Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No breeding records found</p>
            <p className="text-sm">
              {goat.gender === 'female' ? 
                'Breeding records will show matings and kids born' : 
                'Breeding records will show matings performed'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kids/Offspring Placeholder */}
      {goat.gender === 'female' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Baby className="h-5 w-5" />
              <span>Offspring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No offspring recorded</p>
              <p className="text-sm">Kids born to {goat.name} will appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
