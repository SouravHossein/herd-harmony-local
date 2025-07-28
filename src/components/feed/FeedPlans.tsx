import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feed, FeedPlan } from '@/types/goat';

interface FeedPlansProps {
  feeds: Feed[];
  feedPlans: FeedPlan[];
  onAddFeedPlan: (plan: Omit<FeedPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateFeedPlan: (id: string, updates: Partial<FeedPlan>) => void;
  onDeleteFeedPlan: (id: string) => void;
}

export default function FeedPlans({ 
  feeds, 
  feedPlans, 
  onAddFeedPlan, 
  onUpdateFeedPlan, 
  onDeleteFeedPlan 
}: FeedPlansProps) {
  const [newPlanName, setNewPlanName] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState<'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant'>('kids');
  const [selectedFeedItems, setSelectedFeedItems] = useState<Array<{ feedId: string; amountPerDay: number; frequency: number }>>([]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editedPlanName, setEditedPlanName] = useState('');
  const [editedGroupType, setEditedGroupType] = useState<'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant'>('kids');
  const [editedFeedItems, setEditedFeedItems] = useState<Array<{ feedId: string; amountPerDay: number; frequency: number }>>([]);

  const handleAddFeedItem = () => {
    setSelectedFeedItems([...selectedFeedItems, { feedId: '', amountPerDay: 0, frequency: 1 }]);
  };

  const handleUpdateFeedItem = (index: number, field: string, value: any) => {
    const updatedItems = [...selectedFeedItems];
    updatedItems[index][field] = value;
    setSelectedFeedItems(updatedItems);
  };

  const handleDeleteFeedItem = (index: number) => {
    const updatedItems = [...selectedFeedItems];
    updatedItems.splice(index, 1);
    setSelectedFeedItems(updatedItems);
  };

  const calculateTotalCost = (items: Array<{ feedId: string; amountPerDay: number; frequency: number }>): number => {
    let totalCost = 0;
    items.forEach(item => {
      const feed = feeds.find(f => f.id === item.feedId);
      if (feed) {
        totalCost += (feed.costPerKg * item.amountPerDay) * item.frequency;
      }
    });
    return totalCost;
  };

  const handleAddPlan = () => {
    if (newPlanName && selectedFeedItems.length > 0) {
      const totalCostPerDay = calculateTotalCost(selectedFeedItems);
      onAddFeedPlan({
        name: newPlanName,
        groupType: selectedGroupType,
        feedItems: selectedFeedItems,
        totalCostPerDay: totalCostPerDay,
        
      });
      setNewPlanName('');
      setSelectedGroupType('kids');
      setSelectedFeedItems([]);
    }
  };

  const handleEditPlan = (plan: FeedPlan) => {
    setEditingPlanId(plan.id);
    setEditedPlanName(plan.name);
    setEditedGroupType(plan.groupType);
    setEditedFeedItems(plan.feedItems);
  };

  const handleUpdateEditedFeedItem = (index: number, field: string, value: any) => {
    const updatedItems = [...editedFeedItems];
    updatedItems[index][field] = value;
    setEditedFeedItems(updatedItems);
  };

  const handleAddEditedFeedItem = () => {
    setEditedFeedItems([...editedFeedItems, { feedId: '', amountPerDay: 0, frequency: 1 }]);
  };

  const handleDeleteEditedFeedItem = (index: number) => {
    const updatedItems = [...editedFeedItems];
    updatedItems.splice(index, 1);
    setEditedFeedItems(updatedItems);
  };

  const handleSavePlan = () => {
    if (editingPlanId && editedPlanName && editedFeedItems.length > 0) {
      const totalCostPerDay = calculateTotalCost(editedFeedItems);
      onUpdateFeedPlan(editingPlanId, {
        name: editedPlanName,
        groupType: editedGroupType,
        feedItems: editedFeedItems,
        totalCostPerDay: totalCostPerDay,
      });
      setEditingPlanId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Feed Plans</h2>
        <p className="text-muted-foreground">Manage feeding schedules</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Feed Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="groupType">Group Type</Label>
            <select
              id="groupType"
              className="border rounded px-2 py-1"
              value={selectedGroupType}
              onChange={(e) => setSelectedGroupType(e.target.value as 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant')}
            >
              <option value="kids">Kids</option>
              <option value="adults">Adults</option>
              <option value="lactating">Lactating</option>
              <option value="bucks">Bucks</option>
              <option value="pregnant">Pregnant</option>
            </select>
          </div>
          <div>
            <Label>Feed Items</Label>
            {selectedFeedItems.map((item, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <select
                  className="border rounded px-2 py-1"
                  value={item.feedId}
                  onChange={(e) => handleUpdateFeedItem(index, 'feedId', e.target.value)}
                >
                  <option value="">Select Feed</option>
                  {feeds.map(feed => (
                    <option key={feed.id} value={feed.id}>{feed.name}</option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Amount (kg)"
                  value={item.amountPerDay}
                  onChange={(e) => handleUpdateFeedItem(index, 'amountPerDay', parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Frequency"
                  value={item.frequency}
                  onChange={(e) => handleUpdateFeedItem(index, 'frequency', parseInt(e.target.value))}
                />
                <Button variant="outline" size="icon" onClick={() => handleDeleteFeedItem(index)}>
                  X
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddFeedItem}>Add Feed Item</Button>
          </div>
          <Button onClick={handleAddPlan}>Add Feed Plan</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Feed Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {feedPlans.map(plan => (
            <div key={plan.id} className="mb-4 p-4 border rounded">
              {editingPlanId === plan.id ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editPlanName">Plan Name</Label>
                    <Input
                      id="editPlanName"
                      value={editedPlanName}
                      onChange={(e) => setEditedPlanName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editGroupType">Group Type</Label>
                    <select
                      id="editGroupType"
                      className="border rounded px-2 py-1"
                      value={editedGroupType}
                      onChange={(e) => setEditedGroupType(e.target.value as 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant')}
                    >
                      <option value="kids">Kids</option>
                      <option value="adults">Adults</option>
                      <option value="lactating">Lactating</option>
                      <option value="bucks">Bucks</option>
                      <option value="pregnant">Pregnant</option>
                    </select>
                  </div>
                  <div>
                    <Label>Feed Items</Label>
                    {editedFeedItems.map((item, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <select
                          className="border rounded px-2 py-1"
                          value={item.feedId}
                          onChange={(e) => handleUpdateEditedFeedItem(index, 'feedId', e.target.value)}
                        >
                          <option value="">Select Feed</option>
                          {feeds.map(feed => (
                            <option key={feed.id} value={feed.id}>{feed.name}</option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          placeholder="Amount (kg)"
                          value={item.amountPerDay}
                          onChange={(e) => handleUpdateEditedFeedItem(index, 'amountPerDay', parseFloat(e.target.value))}
                        />
                        <Input
                          type="number"
                          placeholder="Frequency"
                          value={item.frequency}
                          onChange={(e) => handleUpdateEditedFeedItem(index, 'frequency', parseInt(e.target.value))}
                        />
                        <Button variant="outline" size="icon" onClick={() => handleDeleteEditedFeedItem(index)}>
                          X
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddEditedFeedItem}>Add Feed Item</Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSavePlan}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingPlanId(null)}>Cancel</Button>
                  </div>
                }
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Group: {plan.groupType}
                    </p>
                    <ul>
                      {plan.feedItems.map(item => {
                        const feed = feeds.find(f => f.id === item.feedId);
                        return (
                          feed && (
                            <li key={item.feedId} className="text-sm">
                              {feed.name}: {item.amountPerDay}kg ({item.frequency} times/day)
                            </li>
                          )
                        );
                      })}
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleEditPlan(plan)}>Edit</Button>
                    <Button variant="destructive" onClick={() => onDeleteFeedPlan(plan.id)}>Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
