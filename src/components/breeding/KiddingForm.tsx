
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BreedingRecord } from '@/types/breeding';

interface KiddingFormProps {
  breedingRecords: BreedingRecord[];
  onSubmit: (data: {
    breedingId: string;
    birthDate: Date;
    totalKids: number;
    kidDetails: Array<{
      id: string;
      name: string;
      gender: 'male' | 'female';
      birthWeight: number;
      status: 'alive' | 'deceased' | 'weak';
      notes?: string;
    }>;
    complications?: string;
    vetAssistance: boolean;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export default function KiddingForm({ breedingRecords, onSubmit, onCancel }: KiddingFormProps) {
  const [selectedBreeding, setSelectedBreeding] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalKids, setTotalKids] = useState(1);
  const [kidDetails, setKidDetails] = useState([
    { id: '1', name: '', gender: 'male' as const, birthWeight: 0, status: 'alive' as const, notes: '' }
  ]);
  const [complications, setComplications] = useState('');
  const [vetAssistance, setVetAssistance] = useState(false);
  const [notes, setNotes] = useState('');

  const handleKidCountChange = (count: number) => {
    setTotalKids(count);
    const newKidDetails = [];
    for (let i = 0; i < count; i++) {
      newKidDetails.push(
        kidDetails[i] || {
          id: (i + 1).toString(),
          name: '',
          gender: 'male' as const,
          birthWeight: 0,
          status: 'alive' as const,
          notes: ''
        }
      );
    }
    setKidDetails(newKidDetails);
  };

  const updateKidDetail = (index: number, field: string, value: any) => {
    const updated = [...kidDetails];
    updated[index] = { ...updated[index], [field]: value };
    setKidDetails(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBreeding) return;

    onSubmit({
      breedingId: selectedBreeding,
      birthDate: new Date(birthDate),
      totalKids,
      kidDetails,
      complications: complications || undefined,
      vetAssistance,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Kidding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="breeding">Select Breeding Record</Label>
            <Select value={selectedBreeding} onValueChange={setSelectedBreeding}>
              <SelectTrigger>
                <SelectValue placeholder="Select a breeding record" />
              </SelectTrigger>
              <SelectContent>
                {breedingRecords.map((breeding) => (
                  <SelectItem key={breeding.id} value={breeding.id}>
                    Breeding {new Date(breeding.breedingDate).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="totalKids">Number of Kids</Label>
            <Input
              id="totalKids"
              type="number"
              min="1"
              max="5"
              value={totalKids}
              onChange={(e) => handleKidCountChange(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Kid Details</Label>
            {kidDetails.map((kid, index) => (
              <div key={kid.id} className="grid gap-3 p-4 border rounded-lg">
                <h4 className="font-medium">Kid {index + 1}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={kid.name}
                      onChange={(e) => updateKidDetail(index, 'name', e.target.value)}
                      placeholder="Kid name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`gender-${index}`}>Gender</Label>
                    <Select value={kid.gender} onValueChange={(value) => updateKidDetail(index, 'gender', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`weight-${index}`}>Birth Weight (kg)</Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      step="0.1"
                      value={kid.birthWeight}
                      onChange={(e) => updateKidDetail(index, 'birthWeight', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select value={kid.status} onValueChange={(value) => updateKidDetail(index, 'status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alive">Alive</SelectItem>
                        <SelectItem value="deceased">Deceased</SelectItem>
                        <SelectItem value="weak">Weak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`notes-${index}`}>Notes</Label>
                  <Textarea
                    id={`notes-${index}`}
                    value={kid.notes}
                    onChange={(e) => updateKidDetail(index, 'notes', e.target.value)}
                    placeholder="Additional notes for this kid..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="complications">Complications</Label>
            <Textarea
              id="complications"
              value={complications}
              onChange={(e) => setComplications(e.target.value)}
              placeholder="Any complications during birth..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="vetAssistance"
              checked={vetAssistance}
              onCheckedChange={setVetAssistance}
            />
            <Label htmlFor="vetAssistance">Veterinary assistance required</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="General notes about the kidding..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedBreeding}>
              Record Kidding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
