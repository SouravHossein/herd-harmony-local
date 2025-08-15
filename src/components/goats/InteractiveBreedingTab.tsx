
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Baby, Heart, AlertTriangle } from 'lucide-react';
import { Goat, BreedingRecord } from '@/types/goat';
import { useGoatContext } from '@/context/GoatContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BreedingForm from '../breeding/BreedingForm';
import EnhancedKiddingForm from '../breeding/EnhancedKiddingForm';
import { toast } from '@/components/ui/use-toast';

interface InteractiveBreedingTabProps {
  goat: Goat;
}

export function InteractiveBreedingTab({ goat }: InteractiveBreedingTabProps) {
  const { 
    breedingRecords, 
    goats,
    addBreedingRecord,
    updateBreedingRecord 
  } = useGoatContext();
  
  const [isBreedingFormOpen, setIsBreedingFormOpen] = useState(false);
  const [isKiddingFormOpen, setIsKiddingFormOpen] = useState(false);
  const [selectedBreeding, setSelectedBreeding] = useState<BreedingRecord | null>(null);

  // Get breeding records for this goat (as dam or sire)
  const goatBreedings = breedingRecords.filter(
    record => record.damId === goat.id || record.sireId === goat.id
  );

  // Get offspring records
  const offspring = goats.filter(g => g.fatherId === goat.id || g.motherId === goat.id);

  const handleAddBreeding = async (breedingData: any) => {
    try {
      await addBreedingRecord(breedingData);
      setIsBreedingFormOpen(false);
      toast({
        title: "Success",
        description: "Breeding record added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add breeding record",
        variant: "destructive",
      });
    }
  };

  const handleRecordKidding = (breeding: BreedingRecord) => {
    setSelectedBreeding(breeding);
    setIsKiddingFormOpen(true);
  };

  const handleKiddingSubmit = async (kiddingData: any) => {
    if (selectedBreeding) {
      try {
        // Update breeding record with kidding information
        await updateBreedingRecord(selectedBreeding.id, {
          actualBirthDate: kiddingData.birthDate,
          kidDetails: kiddingData.kidDetails,
          updatedAt: new Date()
        });
        
        setIsKiddingFormOpen(false);
        setSelectedBreeding(null);
        
        toast({
          title: "Success",
          description: "Kidding record added successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to record kidding",
          variant: "destructive",
        });
      }
    }
  };

  const getBreedingStatus = (breeding: BreedingRecord) => {
    if (breeding.actualBirthDate) return 'completed';
    if (breeding.expectedDueDate && new Date(breeding.expectedDueDate) < new Date()) return 'overdue';
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setIsBreedingFormOpen(true)} className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Record Breeding
        </Button>
      </div>

      {/* Active Breedings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Breeding Records ({goatBreedings.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goatBreedings.length > 0 ? (
            <div className="space-y-4">
              {goatBreedings.map((breeding) => {
                const partner = goats.find(g => 
                  g.id === (breeding.damId === goat.id ? breeding.sireId : breeding.damId)
                );
                const status = getBreedingStatus(breeding);
                
                return (
                  <div key={breeding.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {goat.id === breeding.damId ? 'Dam' : 'Sire'} paired with {partner?.name || 'Unknown'}
                        </span>
                        {getStatusBadge(status)}
                      </div>
                      {status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleRecordKidding(breeding)}
                        >
                          <Baby className="h-4 w-4 mr-1" />
                          Record Kidding
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Breeding Date: {new Date(breeding.breedingDate).toLocaleDateString()}</p>
                      {breeding.expectedDueDate && (
                        <p>Expected Due: {new Date(breeding.expectedDueDate).toLocaleDateString()}</p>
                      )}
                      {breeding.actualBirthDate && (
                        <p>Birth Date: {new Date(breeding.actualBirthDate).toLocaleDateString()}</p>
                      )}
                      {breeding.kidDetails && (
                        <p>Kids: {breeding.kidDetails.length} ({breeding.kidDetails.filter(k => k.status === 'alive').length} alive)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No breeding records found for {goat.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Offspring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Baby className="h-5 w-5" />
            <span>Offspring ({offspring.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {offspring.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offspring.map((kid) => (
                <div key={kid.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{kid.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Born: {new Date(kid.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={kid.gender === 'male' ? 'default' : 'secondary'}>
                      {kid.gender === 'male' ? '♂' : '♀'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No offspring records found for {goat.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Breeding Form Dialog */}
      <Dialog open={isBreedingFormOpen} onOpenChange={setIsBreedingFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Breeding</DialogTitle>
          </DialogHeader>
          <BreedingForm
            goat={goat}
            onSubmit={handleAddBreeding}
            onCancel={() => setIsBreedingFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Kidding Form Dialog */}
      <Dialog open={isKiddingFormOpen} onOpenChange={setIsKiddingFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Record Kidding</DialogTitle>
          </DialogHeader>
          {selectedBreeding && (
            <EnhancedKiddingForm
              breedingRecord={selectedBreeding}
              onSubmit={handleKiddingSubmit}
              onCancel={() => {
                setIsKiddingFormOpen(false);
                setSelectedBreeding(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
