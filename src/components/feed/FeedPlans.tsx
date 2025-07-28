
import React, { useState, useEffect } from 'react';
import { useGoatData } from '@/hooks/useDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Calculator, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedPlan, FeedPlanItem } from '@/types/goat';
import { useToast } from '@/hooks/use-toast';

export function FeedPlans() {
  const { feeds, feedPlans, goats, addFeedPlan, updateFeedPlan, deleteFeedPlan } = useGoatData();
  const [selectedPlan, setSelectedPlan] = useState<FeedPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'adult',
    description: '',
    feedItems: [] as FeedPlanItem[],
    isActive: true,
    totalCostPerDay: 0,
    totalCostPerMonth: 0
  });

  const [newFeedItem, setNewFeedItem] = useState({
    feedId: '',
    amountPerDay: 0,
    notes: ''
  });

  useEffect(() => {
    calculateTotalCost();
  }, [formData.feedItems]);

  const calculateTotalCost = () => {
    let dailyCost = 0;
    formData.feedItems.forEach(item => {
      const feed = feeds.find(f => f.id === item.feedId);
      if (feed) {
        dailyCost += feed.costPerKg * item.amountPerDay;
      }
    });
    setFormData(prev => ({
      ...prev,
      totalCostPerDay: dailyCost,
      totalCostPerMonth: dailyCost * 30
    }));
  };

  const handleAddFeedItem = () => {
    if (!newFeedItem.feedId || newFeedItem.amountPerDay <= 0) {
      toast({
        title: "Error",
        description: "Please select a feed and enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const feed = feeds.find(f => f.id === newFeedItem.feedId);
    if (!feed) return;

    const feedItem: FeedPlanItem = {
      id: Date.now().toString(),
      feedId: newFeedItem.feedId,
      feedName: feed.name,
      amountPerDay: newFeedItem.amountPerDay,
      costPerDay: feed.costPerKg * newFeedItem.amountPerDay,
      notes: newFeedItem.notes
    };

    setFormData(prev => ({
      ...prev,
      feedItems: [...prev.feedItems, feedItem]
    }));

    setNewFeedItem({
      feedId: '',
      amountPerDay: 0,
      notes: ''
    });
  };

  const handleRemoveFeedItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      feedItems: prev.feedItems.filter(item => item.id !== itemId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.feedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a plan name and add at least one feed item",
        variant: "destructive"
      });
      return;
    }

    const planData = {
      ...formData,
      id: selectedPlan?.id || Date.now().toString(),
      createdAt: selectedPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (selectedPlan) {
        await updateFeedPlan(selectedPlan.id, planData);
        toast({
          title: "Success",
          description: "Feed plan updated successfully"
        });
      } else {
        await addFeedPlan(planData);
        toast({
          title: "Success",
          description: "Feed plan created successfully"
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save feed plan",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'adult',
      description: '',
      feedItems: [],
      isActive: true,
      totalCostPerDay: 0,
      totalCostPerMonth: 0
    });
    setSelectedPlan(null);
    setIsFormOpen(false);
  };

  const handleEdit = (plan: FeedPlan) => {
    setSelectedPlan(plan);
    setFormData(plan);
    setIsFormOpen(true);
  };

  const handleDelete = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this feed plan?')) {
      try {
        await deleteFeedPlan(planId);
        toast({
          title: "Success",
          description: "Feed plan deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete feed plan",
          variant: "destructive"
        });
      }
    }
  };

  const activePlans = feedPlans.filter(plan => plan.isActive);
  const inactivePlans = feedPlans.filter(plan => !plan.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Feed Plans</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              New Feed Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPlan ? 'Edit Feed Plan' : 'Create New Feed Plan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Adult Doe Standard"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kid">Kid (0-6 months)</SelectItem>
                      <SelectItem value="young">Young (6-12 months)</SelectItem>
                      <SelectItem value="adult">Adult (12+ months)</SelectItem>
                      <SelectItem value="pregnant">Pregnant Doe</SelectItem>
                      <SelectItem value="lactating">Lactating Doe</SelectItem>
                      <SelectItem value="breeding">Breeding Buck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the feeding plan..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Feed Items</h3>
                  <Badge variant="secondary">
                    Daily Cost: ${formData.totalCostPerDay.toFixed(2)}
                  </Badge>
                </div>

                {/* Add Feed Item Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Add Feed Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Feed</Label>
                        <Select 
                          value={newFeedItem.feedId} 
                          onValueChange={(value) => setNewFeedItem(prev => ({ ...prev, feedId: value }))}
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
                        <Label>Amount per Day (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={newFeedItem.amountPerDay}
                          onChange={(e) => setNewFeedItem(prev => ({ ...prev, amountPerDay: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Input
                          value={newFeedItem.notes}
                          onChange={(e) => setNewFeedItem(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Optional notes"
                        />
                      </div>
                    </div>
                    <Button type="button" onClick={handleAddFeedItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feed Item
                    </Button>
                  </CardContent>
                </Card>

                {/* Feed Items List */}
                {formData.feedItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Plan Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {formData.feedItems.map(item => (
                          <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <span className="font-medium">{item.feedName}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {item.amountPerDay}kg/day - ${item.costPerDay.toFixed(2)}/day
                              </span>
                              {item.notes && (
                                <div className="text-sm text-muted-foreground">{item.notes}</div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeedItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cost Summary */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Daily Cost:</span>
                        <span className="ml-2">${formData.totalCostPerDay.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Monthly Cost:</span>
                        <span className="ml-2">${formData.totalCostPerMonth.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plans">Active Plans</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {activePlans.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No active feed plans found. Create your first feed plan to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {activePlans.map(plan => (
                <Card key={plan.id}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {plan.category}
                        </Badge>
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
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Feed Items:</h4>
                      {plan.feedItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.feedName}</span>
                          <span>{item.amountPerDay}kg/day</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Daily Cost:</span>
                        <span className="font-medium">${plan.totalCostPerDay.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly Cost:</span>
                        <span className="font-medium">${plan.totalCostPerMonth.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactivePlans.length === 0 ? (
            <Alert>
              <AlertDescription>
                No inactive feed plans.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {inactivePlans.map(plan => (
                <Card key={plan.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {plan.category} - Inactive
                        </Badge>
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
                    <div className="text-sm text-muted-foreground">
                      {plan.feedItems.length} feed items • ${plan.totalCostPerDay.toFixed(2)}/day
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
