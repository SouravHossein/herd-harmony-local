
import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Feed } from '@/types/goat';

interface FeedInventoryProps {
  feeds: Feed[];
  onAddFeed: (feed: Omit<Feed, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateFeed: (id: string, updates: Partial<Feed>) => void;
  onDeleteFeed: (id: string) => void;
}

export const FeedInventory: React.FC<FeedInventoryProps> = ({
  feeds,
  onAddFeed,
  onUpdateFeed,
  onDeleteFeed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'hay' as const,
    costPerKg: 0,
    stockKg: 0,
    expiryDate: '',
    supplier: '',
    nutritionalInfo: {
      protein: 0,
      fiber: 0,
      energy: 0
    }
  });

  const filteredFeeds = feeds.filter(feed => {
    const matchesSearch = feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feed.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || feed.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedData = {
      ...formData,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    };

    if (editingFeed) {
      await onUpdateFeed(editingFeed.id, feedData);
    } else {
      await onAddFeed(feedData);
    }

    setShowForm(false);
    setEditingFeed(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'hay',
      costPerKg: 0,
      stockKg: 0,
      expiryDate: '',
      supplier: '',
      nutritionalInfo: {
        protein: 0,
        fiber: 0,
        energy: 0
      }
    });
  };

  const handleEdit = (feed: Feed) => {
    setEditingFeed(feed);
    setFormData({
      name: feed.name,
      type: feed.type,
      costPerKg: feed.costPerKg,
      stockKg: feed.stockKg,
      expiryDate: feed.expiryDate ? new Date(feed.expiryDate).toISOString().split('T')[0] : '',
      supplier: feed.supplier,
      nutritionalInfo: feed.nutritionalInfo || {
        protein: 0,
        fiber: 0,
        energy: 0
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feed?')) {
      await onDeleteFeed(id);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return <Badge variant="destructive">Critical</Badge>;
    if (stock <= 20) return <Badge variant="secondary">Low</Badge>;
    return <Badge variant="outline">Good</Badge>;
  };

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    
    const days = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return <Badge variant="destructive">Expired</Badge>;
    if (days <= 7) return <Badge variant="destructive">Expires Soon</Badge>;
    if (days <= 30) return <Badge variant="secondary">Expires This Month</Badge>;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="hay">Hay</SelectItem>
              <SelectItem value="grain">Grain</SelectItem>
              <SelectItem value="supplement">Supplement</SelectItem>
              <SelectItem value="pellet">Pellet</SelectItem>
              <SelectItem value="mineral">Mineral</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Feed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFeed ? 'Edit Feed' : 'Add New Feed'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Feed Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Alfalfa Hay"
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
                      <SelectItem value="hay">Hay</SelectItem>
                      <SelectItem value="grain">Grain</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="pellet">Pellet</SelectItem>
                      <SelectItem value="mineral">Mineral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="costPerKg">Cost per Kg ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.costPerKg}
                    onChange={(e) => setFormData({...formData, costPerKg: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stockKg">Stock (Kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.stockKg}
                    onChange={(e) => setFormData({...formData, stockKg: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Local Feed Store"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Nutritional Information (Optional)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="protein">Protein (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.nutritionalInfo.protein}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionalInfo: {
                          ...formData.nutritionalInfo,
                          protein: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiber">Fiber (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.nutritionalInfo.fiber}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionalInfo: {
                          ...formData.nutritionalInfo,
                          fiber: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="energy">Energy (MJ/kg)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.nutritionalInfo.energy}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionalInfo: {
                          ...formData.nutritionalInfo,
                          energy: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFeed ? 'Update' : 'Add'} Feed
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredFeeds.map((feed) => (
          <Card key={feed.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{feed.name}</CardTitle>
                  <Badge variant="outline">{feed.type}</Badge>
                  {getStockStatus(feed.stockKg)}
                  {getExpiryStatus(feed.expiryDate)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(feed)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(feed.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium">{feed.stockKg} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost/kg</p>
                  <p className="font-medium">${feed.costPerKg.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{feed.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-medium">${(feed.stockKg * feed.costPerKg).toFixed(2)}</p>
                </div>
              </div>
              
              {feed.nutritionalInfo && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Nutritional Information</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-medium">{feed.nutritionalInfo.protein}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fiber</p>
                      <p className="font-medium">{feed.nutritionalInfo.fiber}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Energy</p>
                      <p className="font-medium">{feed.nutritionalInfo.energy} MJ/kg</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeeds.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No feeds found</p>
        </div>
      )}
    </div>
  );
};
