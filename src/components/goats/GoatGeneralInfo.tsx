
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  MapPin,
  Baby,
  Tag,
  FileText,
  Heart,
  Activity,
  Star
} from 'lucide-react';
import { Goat } from '@/types/goat';

interface GoatGeneralInfoProps {
  goat: Goat;
}

export default function GoatGeneralInfo({ goat }: GoatGeneralInfoProps) {
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBreedingStatusColor = (status: string) => {
    switch (status) {
      case 'pregnant': return 'bg-purple-100 text-purple-800';
      case 'lactating': return 'bg-blue-100 text-blue-800';
      case 'kid': return 'bg-pink-100 text-pink-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'resting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Image Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Photos</span>
            {goat.mediaFiles?.filter(m => m.type === 'image').length && (
              <Badge variant="outline">{goat.mediaFiles.filter(m => m.type === 'image').length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goat.mediaFiles?.filter(m => m.type === 'image').length ? (
            <div className="grid grid-cols-2 gap-2">
              {goat.mediaFiles.filter(m => m.type === 'image').slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative aspect-square">
                  <img
                    src={media.url}
                    alt={`${goat.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  {media.category && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 right-1 text-xs"
                    >
                      {media.category}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                {goat.gender === 'female' ? (
                  <Heart className="h-8 w-8 text-pink-500" />
                ) : (
                  <Activity className="h-8 w-8 text-blue-500" />
                )}
              </div>
              <p>No photos uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium flex items-center space-x-2">
                <span>{goat.name}</span>
                {goat.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
              </p>
            </div>
            {/* <div>
              <p className="text-sm text-muted-foreground">Nickname</p>
              <p className="font-medium">{goat.nickname || 'None'}</p>
            </div> */}
            <div>
              <p className="text-sm text-muted-foreground">Tag Number</p>
              <p className="font-medium">#{goat.tagNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Breed</p>
              <p className="font-medium capitalize">{goat.breed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <div className="flex items-center space-x-2">
                {goat.gender === 'female' ? (
                  <Heart className="h-4 w-4 text-pink-500" />
                ) : (
                  <Activity className="h-4 w-4 text-blue-500" />
                )}
                <span className="font-medium capitalize">{goat.gender}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{goat.color}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge 
                variant={goat.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {goat.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Breeding Status</p>
              <Badge className={getBreedingStatusColor(goat.breedingStatus)}>
                {goat.breedingStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Birth & Acquisition Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Birth & Acquisition</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="font-medium">{formatDate(goat.birthDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Acquisition Type</p>
            <Badge variant="outline" className="capitalize">
              {goat.acquisitionType}
            </Badge>
          </div>
          {goat.birthWeight && (
            <div>
              <p className="text-sm text-muted-foreground">Birth Weight</p>
              <p className="font-medium">{goat.birthWeight} kg</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Added to Herd</p>
            <p className="font-medium">{formatDate(goat.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Parentage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Baby className="h-5 w-5" />
            <span>Parentage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Father (Sire)</p>
            <p className="font-medium">{goat.fatherId ? `ID: ${goat.fatherId}` : 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mother (Dam)</p>
            <p className="font-medium">{goat.motherId ? `ID: ${goat.motherId}` : 'Unknown'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Tags & Notes */}
      {(goat.tags?.length || goat.notes) && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Tags & Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goat.tags?.length && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Custom Tags</p>
                <div className="flex flex-wrap gap-2">
                  {goat.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {goat.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{goat.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
