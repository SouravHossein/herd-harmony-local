import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Baby, Heart, Calendar, User, Plus, Eye, Edit } from 'lucide-react';
import { Goat, BreedingRecord } from '@/types/goat';
import { useGoatContext } from '@/context/GoatContext';
import BreedingForm from '@/components/breeding/BreedingForm';
import EnhancedKiddingForm from '@/components/breeding/EnhancedKiddingForm';
import { useToast } from '@/hooks/use-toast';

interface InteractiveBreedingTabProps {
  goat: Goat;
}

export function InteractiveBreedingTab({ goat }: InteractiveBreedingTabProps) {
  const { goats, breedingRecords } = useGoatContext();
  const { toast } = useToast();
  const [isBreedingDialogOpen, setIsBreedingDialogOpen] = useState(false);
  const [isKiddingDialogOpen, setIsKiddingDialogOpen] = useState(false);
  const [goatBreedingRecords, setGoatBreedingRecords] = useState<BreedingRecord[]>([]);
  const [goatKiddingRecords, setGoatKiddingRecords] = useState<any[]>([]);
  const [offspring, setOffspring] = useState<Goat[]>([]);

  useEffect(() => {
    // Find breeding records where this goat is sire or dam
    const relevantBreedingRecords = (breedingRecords || []).filter(record => 
      record.sireId === goat.id || record.damId === goat.id
    );
    setGoatBreedingRecords(relevantBreedingRecords);

    // Mock kidding records for now
    setGoatKiddingRecords([]);

    // Find offspring (goats where this goat is parent)
    const goatOffspring = goats.filter(g => 
      g.fatherId === goat.id || g.motherId === goat.id
    );
    setOffspring(goatOffspring);
  }, [goat.id, goats, breedingRecords]);

  const getParentName = (parentId?: string) => {
    const parent = goats.find(g => g.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const getAge = (birthDate: Date) => {
    const today = new Date();
    const ageInMs = today.getTime() - birthDate.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 30) {
      return `${ageInDays} days`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} months`;
    } else {
      const years = Math.floor(ageInDays / 365);
      const remainingMonths = Math.floor((ageInDays % 365) / 30);
      return `${years}y ${remainingMonths}m`;
    }
  };

  const handleBreedingSuccess = () => {
    setIsBreedingDialogOpen(false);
    toast({
      title: "Breeding record added",
      description: "The breeding record has been successfully added."
    });
  };

  const handleKiddingSuccess = () => {
    setIsKiddingDialogOpen(false);
    toast({
      title: "Kidding record added",
      description: "The kidding record and kids have been successfully added."
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Dialog open={isBreedingDialogOpen} onOpenChange={setIsBreedingDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Heart className="h-4 w-4 mr-2" />
              Record Breeding
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Breeding</DialogTitle>
            </DialogHeader>
            <BreedingForm 
              onSuccess={handleBreedingSuccess}
            />
          </DialogContent>
        </Dialog>

        {goat.gender === 'female' && (
          <Dialog open={isKiddingDialogOpen} onOpenChange={setIsKiddingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Baby className="h-4 w-4 mr-2" />
                Record Kidding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Record Kidding</DialogTitle>
              </DialogHeader>
              <EnhancedKiddingForm 
                onSuccess={handleKiddingSuccess}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{getParentName(goat.fatherId)}</p>
                    <Badge variant="outline">Known</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{getParentName(goat.motherId)}</p>
                    <Badge variant="outline">Known</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
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

      {/* Breeding History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Breeding Records</span>
            <Badge variant="outline">{goatBreedingRecords.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goatBreedingRecords.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No breeding records yet</p>
                <p className="text-sm">Breeding history will appear here</p>
              </div>
            ) : (
              goatBreedingRecords.map(record => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium">
                          {goat.gender === 'male' ? 'Bred with' : 'Bred by'}: {
                            goat.gender === 'male' 
                              ? getParentName(record.damId)
                              : getParentName(record.sireId)
                          }
                        </p>
                        <Badge variant="outline">
                          {record.pregnancyStatus || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Breeding Date:</span> {new Date(record.breedingDate).toLocaleDateString()}
                        </p>
                        {record.expectedDueDate && (
                          <p>
                            <span className="font-medium">Expected Due:</span> {new Date(record.expectedDueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{record.notes}"</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kidding Records */}
      {goat.gender === 'female' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Kidding Records</span>
              <Badge variant="outline">{goatKiddingRecords.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goatKiddingRecords.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No kidding records yet</p>
                  <p className="text-sm">Kidding history will appear here</p>
                </div>
              ) : (
                goatKiddingRecords.map(record => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Kidding Record</p>
                        <p className="text-sm text-muted-foreground">
                          Details will be available when kidding records are implemented
                        </p>
                      </div>
                      <Badge variant="outline">
                        {record.complications ? 'Complications' : 'Normal'}
                      </Badge>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-muted-foreground italic">"{record.notes}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offspring */}
      {(goat.gender === 'female' || offspring.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Baby className="h-5 w-5" />
              <span>Offspring</span>
              <Badge variant="outline">{offspring.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offspring.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No offspring yet</p>
                  <p className="text-sm">Kids will appear here when born</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {offspring.map(kid => (
                    <div key={kid.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {kid.gender === 'male' ? '♂' : '♀'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{kid.name}</p>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Born: {new Date(kid.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Age: {getAge(kid.dateOfBirth)}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {kid.status}
                            </Badge>
                            {kid.currentWeight && (
                              <Badge variant="secondary" className="text-xs">
                                {kid.currentWeight} kg
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}