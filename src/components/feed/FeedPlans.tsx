
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
import { Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { FeedPlan } from '@/types/goat';

export function FeedPlans() {
  const { feeds, feedPlans, addFeedPlan, updateFeedPlan, deleteFeedPlan } = useGoatData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FeedPlan | null>(null);

  const handleAddPlan = (formData: FormData) => {
    const planData = {
      name: formData.get('name') as string,
      groupType: formData.get('groupType') as 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant',
      feedItems: [], // Will be populated by feed item form
      totalCostPerDay: 0,
    };

    addFeedPlan(planData);
    setIsAddDialogOpen(false);
    toast({
      title: "Feed Plan Created",
      description: `${planData.name} has been created`,
    });
  };

  const handleUpdatePlan = (formData: FormData) => {
    if (!editingPlan) return;

    const updates = {
      name: formData.get('name') as string,
      groupType: formData.get('groupType') as 'kids' | 'adults' | 'lactating' | 'bucks' | 'pregnant',
    };

    updateFeedPlan(editingPlan.id, updates);
    setEditingPlan(null);
    toast({
      title: "Feed Plan Updated",
      description: "Feed plan has been updated successfully",
    });
  };

  const handleDeletePlan = (plan: FeedPlan) => {
    if (confirm(`Are you sure you want to delete the feed plan "${plan.name}"?`)) {
      deleteFeedPlan(plan.id);
      toast({
        title: "Feed Plan Deleted",
        description: "The feed plan has been removed",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Feed Plans</h2>
          <p className="text-muted-foreground">Create and manage feeding plans for different goat groups</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feed Plan</DialogTitle>
            </DialogHeader>
            <FeedPlanForm onSubmit={handleAddPlan} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Feed Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedPlans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {plan.groupType}
                  </Badge>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Feed Items:</span>
                  <span className="font-medium">{plan.feedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Daily Cost:</span>
                  <span className="font-medium">${plan.totalCostPerDay.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPlan(plan)}
                  className="flex-1"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePlan(plan)}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Feed Plan</DialogTitle>
            </DialogHeader>
            <FeedPlanForm 
              onSubmit={handleUpdatePlan} 
              initialData={editingPlan}
              isEditing 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface FeedPlanFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FeedPlan;
  isEditing?: boolean;
}

function FeedPlanForm({ onSubmit, initialData, isEditing = false }: FeedPlanFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name *</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={initialData?.name}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="groupType">Group Type *</Label>
        <Select name="groupType" defaultValue={initialData?.groupType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select group type" />
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {isEditing ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
}
