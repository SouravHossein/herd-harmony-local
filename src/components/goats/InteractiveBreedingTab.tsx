
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Calendar, 
  Heart, 
  Baby, 
  Users, 
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Goat, BreedingRecord } from '@/types/goat';
import { formatDate } from '@/lib/utils';

interface InteractiveBreedingTabProps {
  goat: Goat;
}

export function InteractiveBreedingTab({ goat }: InteractiveBreedingTabProps) {
  const [showBreedingForm, setShowBreedingForm] = useState(false);
  const [showKiddingForm, setShowKiddingForm] = useState(false);
  const [selectedBreeding, setSelectedBreeding] = useState<BreedingRecord | null>(null);

  // Mock breeding records - in real app, this would come from props or context
  const breedingRecords: BreedingRecord[] = [
    {
      id: '1',
      doeId: goat.id,
      buckId: 'buck-1',
      breedingDate: new Date('2024-01-15'),
      expectedKiddingDate: new Date('2024-06-15'),
      actualKiddingDate: new Date('2024-06-18'),
      status: 'completed',
      notes: 'Successful breeding, 2 healthy kids',
      kidIds: ['kid-1', 'kid-2']
    }
  ];

  const handleAddBreeding = async (breedingData: any) => {
    console.log('Adding breeding record:', breedingData);
    setShowBreedingForm(false);
  };

  const handleAddKidding = async (kiddingData: any) => {
    console.log('Adding kidding record:', kiddingData);
    setShowKiddingForm(false);
    setSelectedBreeding(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <Baby className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Breeding Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowBreedingForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Record Breeding</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowKiddingForm(true)}
              className="flex items-center space-x-2"
            >
              <Baby className="h-4 w-4" />
              <span>Add Kidding</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Breeding History */}
      <Card>
        <CardHeader>
          <CardTitle>Breeding History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {breedingRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No breeding records found</p>
              <p className="text-sm">Add a breeding record to get started</p>
            </div>
          ) : (
            breedingRecords.map((record, index) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className={`${getStatusColor(record.status)} text-white`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </Badge>
                    <span className="font-medium">Breeding #{index + 1}</span>
                  </div>
                  
                  {record.status === 'confirmed' && !record.actualKiddingDate && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBreeding(record);
                        setShowKiddingForm(true);
                      }}
                    >
                      <Baby className="h-4 w-4 mr-2" />
                      Record Kidding
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Breeding Date</span>
                    </p>
                    <p className="text-muted-foreground">{formatDate(record.breedingDate)}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Expected Kidding</span>
                    </p>
                    <p className="text-muted-foreground">{formatDate(record.expectedKiddingDate)}</p>
                  </div>
                  
                  {record.actualKiddingDate && (
                    <div>
                      <p className="font-medium flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Actual Kidding</span>
                      </p>
                      <p className="text-muted-foreground">{formatDate(record.actualKiddingDate)}</p>
                    </div>
                  )}
                </div>

                {record.kidIds && record.kidIds.length > 0 && (
                  <div>
                    <p className="font-medium flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span>Kids ({record.kidIds.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {record.kidIds.map(kidId => (
                        <Badge key={kidId} variant="secondary">
                          Kid ID: {kidId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {record.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Forms would be rendered here */}
      {showBreedingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Record New Breeding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Breeding form would be implemented here
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => handleAddBreeding({})}>Save</Button>
                <Button variant="outline" onClick={() => setShowBreedingForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showKiddingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Record Kidding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Kidding form would be implemented here
              </p>
              <div className="flex space-x-2">
                <Button onClick={() => handleAddKidding({})}>Save</Button>
                <Button variant="outline" onClick={() => setShowKiddingForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
