
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGoatData } from '@/hooks/useDatabase';
import { HealthRecord, Goat } from '@/types/goat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const HealthRecordsTab: React.FC = () => {
  const { goats, healthRecords, addHealthRecord, updateHealthRecord, deleteHealthRecord } = useGoatData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoat, setSelectedGoat] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [formData, setFormData] = useState({
    goatId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'vaccination' as const,
    description: '',
    medicine: '',
    veterinarian: '',
    nextDueDate: '',
    notes: ''
  });

  const filteredRecords = healthRecords.filter((record: HealthRecord) => {
    const goat = goats.find((g: Goat) => g.id === record.goatId);
    const matchesSearch = goat?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoat = !selectedGoat || record.goatId === selectedGoat;
    return matchesSearch && matchesGoat;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData = {
      ...formData,
      date: new Date(formData.date),
      nextDueDate: formData.nextDueDate ? new Date(formData.nextDueDate) : undefined
    };

    if (editingRecord) {
      await updateHealthRecord(editingRecord.id, recordData);
    } else {
      await addHealthRecord(recordData);
    }

    setShowForm(false);
    setEditingRecord(null);
    setFormData({
      goatId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'vaccination',
      description: '',
      medicine: '',
      veterinarian: '',
      nextDueDate: '',
      notes: ''
    });
  };

  const handleEdit = (record: HealthRecord) => {
    setEditingRecord(record);
    setFormData({
      goatId: record.goatId,
      date: new Date(record.date).toISOString().split('T')[0],
      type: record.type,
      description: record.description,
      medicine: record.medicine || '',
      veterinarian: record.veterinarian || '',
      nextDueDate: record.nextDueDate ? new Date(record.nextDueDate).toISOString().split('T')[0] : '',
      notes: record.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      await deleteHealthRecord(id);
    }
  };

  const getStatusBadge = (record: HealthRecord) => {
    if (record.nextDueDate) {
      const dueDate = new Date(record.nextDueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) {
        return <Badge variant="destructive">Overdue</Badge>;
      } else if (daysUntilDue <= 7) {
        return <Badge variant="secondary">Due Soon</Badge>;
      } else {
        return <Badge variant="outline">Scheduled</Badge>;
      }
    }
    return <Badge variant="default">Completed</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedGoat} onValueChange={setSelectedGoat}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by goat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Goats</SelectItem>
              {goats.map((goat: Goat) => (
                <SelectItem key={goat.id} value={goat.id}>
                  {goat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Health Record' : 'Add Health Record'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goatId">Goat</Label>
                  <Select 
                    value={formData.goatId} 
                    onValueChange={(value) => setFormData({...formData, goatId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goat" />
                    </SelectTrigger>
                    <SelectContent>
                      {goats.map((goat: Goat) => (
                        <SelectItem key={goat.id} value={goat.id}>
                          {goat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: any) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="checkup">Checkup</SelectItem>
                      <SelectItem value="deworming">Deworming</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="veterinarian">Veterinarian</Label>
                  <Input
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                    placeholder="Dr. Smith"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Treatment description"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="medicine">Medicine/Vaccine</Label>
                  <Input
                    value={formData.medicine}
                    onChange={(e) => setFormData({...formData, medicine: e.target.value})}
                    placeholder="Medicine name"
                  />
                </div>
                <div>
                  <Label htmlFor="nextDueDate">Next Due Date</Label>
                  <Input
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => setFormData({...formData, nextDueDate: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRecord ? 'Update' : 'Add'} Record
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredRecords.map((record: HealthRecord) => {
          const goat = goats.find((g: Goat) => g.id === record.goatId);
          return (
            <Card key={record.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{goat?.name}</CardTitle>
                    <Badge variant="outline">{record.type}</Badge>
                    {getStatusBadge(record)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(record)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{record.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  {record.medicine && (
                    <div>
                      <p className="text-sm text-muted-foreground">Medicine</p>
                      <p className="font-medium">{record.medicine}</p>
                    </div>
                  )}
                  {record.veterinarian && (
                    <div>
                      <p className="text-sm text-muted-foreground">Veterinarian</p>
                      <p className="font-medium">{record.veterinarian}</p>
                    </div>
                  )}
                  {record.nextDueDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Next Due</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.nextDueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {record.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{record.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No health records found</p>
        </div>
      )}
    </div>
  );
};
