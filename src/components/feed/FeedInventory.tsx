import React, { useState } from 'react';
import { useGoatData } from '@/hooks/useDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Plus, Package, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { Feed } from '@/types/goat';

export function FeedInventory() {
  const { feeds, addFeed, updateFeed, deleteFeed } = useGoatData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);

  const handleAddFeed = (formData: FormData) => {
    const feedData = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'hay' | 'grain' | 'supplement' | 'pellet' | 'mineral' | 'other',
      costPerKg: parseFloat(formData.get('costPerKg') as string),
      stockKg: parseFloat(formData.get('stockKg') as string),
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : undefined,
      supplier: formData.get('supplier') as string,
      nutritionalInfo: {
        protein: parseFloat(formData.get('protein') as string) || 0,
        fiber: parseFloat(formData.get('fiber') as string) || 0,
        energy: parseFloat(formData.get('energy') as string) || 0,
      },
    };

    addFeed(feedData);
    setIsAddDialogOpen(false);
    toast({
      title: "Feed Added",
      description: `${feedData.name} has been added to inventory`,
    });
  };

  const handleUpdateFeed = (formData: FormData) => {
    if (!editingFeed) return;

    const updates = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'hay' | 'grain' | 'supplement' | 'pellet' | 'mineral' | 'other',
      costPerKg: parseFloat(formData.get('costPerKg') as string),
      stockKg: parseFloat(formData.get('stockKg') as string),
      expiryDate: formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : undefined,
      supplier: formData.get('supplier') as string,
      nutritionalInfo: {
        protein: parseFloat(formData.get('protein') as string) || 0,
        fiber: parseFloat(formData.get('fiber') as string) || 0,
        energy: parseFloat(formData.get('energy') as string) || 0,
      },
    };

    updateFeed(editingFeed.id, updates);
    setEditingFeed(null);
    toast({
      title: "Feed Updated",
      description: "Feed information has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Feed Inventory</h2>
          <p className="text-muted-foreground">Manage your feed stock and track usage</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Feed</DialogTitle>
            </DialogHeader>
            <FeedForm onSubmit={handleAddFeed} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeds.map((feed) => (
          <Card key={feed.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{feed.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {feed.type}
                  </Badge>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock:</span>
                  <span className="font-medium">{feed.stockKg} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cost/kg:</span>
                  <span className="font-medium">${feed.costPerKg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supplier:</span>
                  <span className="font-medium">{feed.supplier}</span>
                </div>
                {feed.expiryDate && (
                  <div className="flex justify-between text-sm">
                    <span>Expires:</span>
                    <span className="font-medium">{formatDate(feed.expiryDate)}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFeed(feed)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFeed(feed.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingFeed && (
        <Dialog open={!!editingFeed} onOpenChange={() => setEditingFeed(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Feed</DialogTitle>
            </DialogHeader>
            <FeedForm 
              onSubmit={handleUpdateFeed} 
              initialData={editingFeed}
              isEditing 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface FeedFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: Feed;
  isEditing?: boolean;
}

function FeedForm({ onSubmit, initialData, isEditing = false }: FeedFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Feed Name *</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={initialData?.name}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Feed Type *</Label>
          <Select name="type" defaultValue={initialData?.type} required>
            <SelectTrigger>
              <SelectValue placeholder="Select feed type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hay">Hay</SelectItem>
              <SelectItem value="grain">Grain</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
              <SelectItem value="pellet">Pellet</SelectItem>
              <SelectItem value="mineral">Mineral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPerKg">Cost per kg *</Label>
          <Input 
            id="costPerKg" 
            name="costPerKg" 
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData?.costPerKg}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockKg">Stock (kg) *</Label>
          <Input 
            id="stockKg" 
            name="stockKg" 
            type="number"
            step="0.1"
            min="0"
            defaultValue={initialData?.stockKg}
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Input 
            id="supplier" 
            name="supplier" 
            defaultValue={initialData?.supplier}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input 
            id="expiryDate" 
            name="expiryDate" 
            type="date"
            defaultValue={initialData?.expiryDate ? 
              new Date(initialData.expiryDate).toISOString().split('T')[0] : ''
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Nutritional Information</Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="protein">Protein %</Label>
            <Input 
              id="protein" 
              name="protein" 
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={initialData?.nutritionalInfo?.protein}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiber">Fiber %</Label>
            <Input 
              id="fiber" 
              name="fiber" 
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={initialData?.nutritionalInfo?.fiber}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energy">Energy (MJ/kg)</Label>
            <Input 
              id="energy" 
              name="energy" 
              type="number"
              step="0.1"
              min="0"
              defaultValue={initialData?.nutritionalInfo?.energy}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {isEditing ? 'Update Feed' : 'Add Feed'}
        </Button>
      </div>
    </form>
  );
}
