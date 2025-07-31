
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, Copy, Image } from 'lucide-react';
import { useGoatContext } from '@/context/GoatContext';
import { Goat } from '@/types/goat';
import GoatForm from './GoatForm';
import { useImageStorage } from '@/hooks/useImageStorage';
import { toast } from '@/components/ui/use-toast';

export default function EnhancedGoatManagement() {
  const { 
    goats, 
    addGoat, 
    updateGoat, 
    deleteGoat, 
    loading, 
    error 
  } = useGoatContext();

  const [selectedGoat, setSelectedGoat] = useState<Goat | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold' | 'deceased'>('all');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');

  const { getImage } = useImageStorage();

  const filteredGoats = goats.filter(goat => {
    const matchesSearch = goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || goat.status === filterStatus;
    const matchesGender = filterGender === 'all' || goat.gender === filterGender;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleAddGoat = () => {
    setSelectedGoat(null);
    setIsFormOpen(true);
  };

  const handleEditGoat = (goat: Goat) => {
    setSelectedGoat(goat);
    setIsFormOpen(true);
  };

  const handleDeleteGoat = async (goatId: string) => {
    if (window.confirm('Are you sure you want to delete this goat?')) {
      try {
        await deleteGoat(goatId);
        toast({
          title: "Success",
          description: "Goat deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete goat",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitGoat = async (goatData: Partial<Goat>) => {
    try {
      if (selectedGoat) {
        await updateGoat(selectedGoat.id, goatData);
        toast({
          title: "Success",
          description: "Goat updated successfully",
        });
      } else {
        await addGoat(goatData);
        toast({
          title: "Success",
          description: "Goat added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: selectedGoat ? "Failed to update goat" : "Failed to add goat",
        variant: "destructive",
      });
    }
  };

  const copyGoatId = (id: string, name: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID copied",
      description: `Copied ${name}'s ID to clipboard`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading goats...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Goat Management</h2>
          <p className="text-muted-foreground">
            Manage your goat herd with photos and pedigree tracking
          </p>
        </div>
        <Button onClick={handleAddGoat}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goat
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search goats by name, tag number, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="deceased">Deceased</option>
            </select>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredGoats.length} of {goats.length} goats
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoats.map((goat) => (
          <GoatCard
            key={goat.id}
            goat={goat}
            onEdit={handleEditGoat}
            onDelete={handleDeleteGoat}
            onCopyId={copyGoatId}
            getImage={getImage}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {filteredGoats.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterGender !== 'all' 
                ? 'No goats match your search criteria' 
                : 'No goats found. Add your first goat to get started!'}
            </div>
            {(!searchTerm && filterStatus === 'all' && filterGender === 'all') && (
              <Button onClick={handleAddGoat} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Goat
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <GoatForm
        goat={selectedGoat}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitGoat}
      />
    </div>
  );
}

function GoatCard({ 
  goat, 
  onEdit, 
  onDelete, 
  onCopyId, 
  getImage, 
  getStatusColor 
}: {
  goat: Goat;
  onEdit: (goat: Goat) => void;
  onDelete: (id: string) => void;
  onCopyId: (id: string, name: string) => void;
  getImage: (id: string) => Promise<string | null>;
  getStatusColor: (status: string) => string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (goat.imageId) {
      getImage(goat.imageId).then(setImageUrl);
    }
  }, [goat.imageId, getImage]);

  const age = Math.floor((new Date().getTime() - goat.dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={goat.name}
                className="w-12 h-12 object-cover rounded-full border-2 border-border"
              />
            ) : (
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Image className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{goat.name}</h3>
              <p className="text-sm text-muted-foreground">#{goat.tagNumber}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyId(goat.id, goat.name)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goat)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goat.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{goat.breed}</span>
            <Badge className={getStatusColor(goat.status)}>
              {goat.status}
            </Badge>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{goat.gender === 'male' ? '♂' : '♀'} {goat.gender}</span>
            <span>{age} years old</span>
          </div>
          
          {goat.color && (
            <div className="text-sm text-muted-foreground">
              Color: {goat.color}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Horn Status: {goat.hornStatus}
          </div>
          
          {goat.notes && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              {goat.notes.length > 100 ? `${goat.notes.substring(0, 100)}...` : goat.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
