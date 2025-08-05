import React, { useState } from 'react';
import { useGoatContext } from '@/context/GoatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDate, calculateAge } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Weight,
  Activity
} from 'lucide-react';
import { Goat } from '@/types/goat';
import GoatForm from './GoatForm';
import GoatLifeTimeline from './media/GoatLifeTimeline';

export function GoatManagement() {
  const { goats, addGoat, updateGoat, deleteGoat, getGoatWeightHistory } = useGoatContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoat, setEditingGoat] = useState<Goat | null>(null);

  // Filter goats based on search and status
  const filteredGoats = goats.filter(goat => {
    const matchesSearch = goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || goat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddGoat = (goatData: Partial<Goat>) => {
    // Check for duplicate tag number
    if (goats.some(goat => goat.tagNumber === goatData.tagNumber)) {
      toast({
        title: "Error",
        description: "A goat with this tag number already exists.",
        variant: "destructive",
      });
      return;
    }

    // Create the goat with required fields
    const newGoat = {
      ...goatData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: goatData.status || 'active',
    } as Goat;

    addGoat(newGoat);
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: `${goatData.name} has been added to your herd.`,
    });
  };

  const handleUpdateGoat = (goatData: Partial<Goat>) => {
    if (!editingGoat) return;

    // Check for duplicate tag number (excluding current goat)
    if (goats.some(goat => goat.tagNumber === goatData.tagNumber && goat.id !== editingGoat.id)) {
      toast({
        title: "Error",
        description: "A goat with this tag number already exists.",
        variant: "destructive",
      });
      return;
    }

    const updates = {
      ...goatData,
      updatedAt: new Date(),
    };

    updateGoat(editingGoat.id, updates);
    setEditingGoat(null);
    toast({
      title: "Success",
      description: `${goatData.name} has been updated.`,
    });
  };

  const handleDeleteGoat = (goat: Goat) => {
    if (confirm(`Are you sure you want to delete ${goat.name}? This action cannot be undone.`)) {
      deleteGoat(goat.id);
      toast({
        title: "Success",
        description: `${goat.name} has been removed from your herd.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Goat Management</h2>
          <p className="text-muted-foreground">Manage your goat herd</p>
        </div>
        
        <Button 
          className="bg-gradient-primary hover:bg-primary-glow shadow-glow"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Goat
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, tag number, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Goats Grid */}
      {filteredGoats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoats.map((goat) => {
            const weightHistory = getGoatWeightHistory(goat.id);
            const currentWeight = weightHistory[weightHistory.length - 1]?.weight;
            
            return (
              // <GoatLifeTimeline goat={goat} />
              <Card key={goat.id} className="shadow-card hover:shadow-soft transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goat.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Tag #{goat.tagNumber}</p>
                    </div>
                    <Badge 
                      variant={
                        goat.status === 'active' ? 'default' : 
                        goat.status === 'sold' ? 'secondary' : 'destructive'
                      }
                    >
                      {goat.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Breed</p>
                      <p className="font-medium capitalize">{goat.breed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{goat.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{calculateAge(goat.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Color</p>
                      <p className="font-medium capitalize">{goat.color}</p>
                    </div>
                  </div>

                  {currentWeight && (
                    <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Current weight: {currentWeight} kg</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Born {formatDate(goat.dateOfBirth)}</span>
                  </div>

                  {goat.notes && (
                    <p className="text-sm text-muted-foreground bg-secondary p-2 rounded-lg">
                      {goat.notes}
                    </p>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingGoat(goat)}
                      className="flex-1"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteGoat(goat)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No goats found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start building your herd by adding your first goat.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goat
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add New Goat Dialog */}
      <GoatForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddGoat}
      />

      {/* Edit Goat Dialog */}
      {editingGoat && (
        <GoatForm
          goat={editingGoat}
          isOpen={!!editingGoat}
          onClose={() => setEditingGoat(null)}
          onSubmit={handleUpdateGoat}
        />
      )}
    </div>
  );
}