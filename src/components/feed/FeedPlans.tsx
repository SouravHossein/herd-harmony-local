
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Feed, FeedPlan } from '@/types/goat';

interface FeedPlansProps {
  feeds: Feed[];
  feedPlans: FeedPlan[];
  onAddFeedPlan: (plan: Omit<FeedPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateFeedPlan: (id: string, updates: Partial<FeedPlan>) => void;
  onDeleteFeedPlan: (id: string) => void;
}

export const FeedPlans: React.FC<FeedPlansProps> = ({
  feeds,
  feedPlans,
  onAddFeedPlan,
  onUpdateFeedPlan,
  onDeleteFeedPlan
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FeedPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    groupType: 'adults' as const,
    feedItems: [{ feedId: '', amountPerDay: 0, frequency: 1 }]
  });

  const calculateTotalCost = () => {
    return formData.feedItems.reduce((total, item) => {
      const feed = feeds.find(f => f.id === item.feedId);
      return total + (feed ? feed.costPerKg * item.amountPerDay : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      ...formData,
      totalCostPerDay: calculateTotalCost()
    };

    if (editingPlan) {
      await onUpdateFeedPlan(editingPlan.id, planData);
    } else {
      await onAddFeedPlan(planData);
    }

    setShowForm(false);
    setEditingPlan(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      groupType: 'adults',
      feedItems: [{ feedId: '', amountPerDay: 0, frequency: 1 }]
    });
  };

  const handleEdit = (plan: FeedPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      groupType: plan.groupType,
      feedItems: plan.feedItems
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feeding plan?')) {
      await onDeleteFeedPlan(id);
    }
  };

  const addFeedItem = () => {
    setFormData({
      ...formData,
      feedItems: [...formData.feedItems, { feedId: '', amountPerDay: 0, frequency: 1 }]
    });
  };

  const removeFeedItem = (index: number) => {
    setFormData({
      ...formData,
      feedItems: formData.feedItems.filter((_, i) => i !== index)
    });
  };

  const updateFeedItem = (index: number, field: string, value: any) => {
    const updated = formData.feedItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, feedItems: updated });
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'kids': return '🐐';
      case 'adults': return '🐏';
      case 'lactating': return '🍼';
      case 'bucks': return '♂️';
      case 'pregnant': return '🤱';
      default: return '🐐';
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'kids': return 'bg-blue-100 text-blue-800';
      case 'adults': return 'bg-green-100 text-green-800';
      case 'lactating': return 'bg-pink-100 text-pink-800';
      case 'bucks': return 'bg-purple-100 text-purple-800';
      case 'pregnant': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Feeding Plans</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Feeding Plan' : 'Create New Feeding Plan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Adult Goat Standard Plan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupType">Group Type</Label>
                  <Select 
                    value={formData.groupType} 
                    onValueChange={(value: any) => setFormData({...formData, groupType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kids">Kids (0-6 months)</SelectItem>
                      <SelectItem value="adults">Adults</SelectItem>
                      <SelectItem value="lactating">Lactating Does</SelectItem>
                      <SelectItem value="bucks">Bucks</SelectItem>
                      <SelectItem value="pregnant">Pregnant Does</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Feed Items</Label>
                  <Button type="button" onClick={addFeedItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feed
                  </Button>
                </div>
                
                {formData.feedItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <Label>Feed</Label>
                      <Select 
                        value={item.feedId} 
                        onValueChange={(value) => updateFeedItem(index, 'feedId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select feed" />
                        </SelectTrigger>
                        <SelectContent>
                          {feeds.map(feed => (
                            <SelectItem key={feed.id} value={feed.id}>
                              {feed.name} (${feed.costPerKg}/kg)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount/Day (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={item.amountPerDay}
                        onChange={(e) => updateFeedItem(index, 'amountPerDay', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Frequency/Day</Label>
                      <Input
                        type="number"
                        value={item.frequency}
                        onChange={(e) => updateFeedItem(index, 'frequency', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeedItem(index)}
                        disabled={formData.feedItems.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span className="font-medium">Total Cost per Day:</span>
                </div>
                <span className="text-lg font-bold">${calculateTotalCost().toFixed(2)}</span>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {feedPlans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getGroupTypeIcon(plan.groupType)}</div>
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge className={getGroupTypeColor(plan.groupType)}>
                      {plan.groupType}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily Cost per Goat</span>
                  <span className="font-bold text-lg">${plan.totalCostPerDay.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Feed Items:</h4>
                  {plan.feedItems.map((item, index) => {
                    const feed = feeds.find(f => f.id === item.feedId);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{feed?.name || 'Unknown Feed'}</span>
                          <Badge variant="outline">{item.frequency}x daily</Badge>
                        </div>
                        <div className="text-sm">
                          {item.amountPerDay}kg - ${feed ? (feed.costPerKg * item.amountPerDay).toFixed(2) : '0.00'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {feedPlans.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No feeding plans created yet</p>
        </div>
      )}
    </div>
  );
};
