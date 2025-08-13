import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Weight, Plus, Edit, Trash, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Goat, WeightRecord } from '@/types/goat';
import { useToast } from '@/hooks/use-toast';

interface InteractiveWeightTabProps {
  goat: Goat;
  weightRecords: WeightRecord[];
  onAddWeight?: (goatId: string, data: { date: Date; weight: number; notes?: string }) => void;
  onUpdateWeight?: (recordId: string, data: { date: Date; weight: number; notes?: string }) => void;
  onDeleteWeight?: (recordId: string) => void;
}

interface WeightFormData {
  date: string;
  weight: string;
  notes: string;
}

export function InteractiveWeightTab({ 
  goat, 
  weightRecords, 
  onAddWeight, 
  onUpdateWeight, 
  onDeleteWeight 
}: InteractiveWeightTabProps) {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeightRecord | null>(null);
  const [formData, setFormData] = useState<WeightFormData>({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: ''
  });

  const sortedRecords = [...weightRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = sortedRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: record.weight,
    originalDate: record.date
  }));

  const getTrendIcon = (currentWeight: number, previousWeight: number) => {
    if (currentWeight > previousWeight) return TrendingUp;
    if (currentWeight < previousWeight) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (currentWeight: number, previousWeight: number) => {
    if (currentWeight > previousWeight) return 'text-green-600';
    if (currentWeight < previousWeight) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive"
      });
      return;
    }

    const data = {
      date: new Date(formData.date),
      weight,
      notes: formData.notes || undefined
    };

    if (editingRecord) {
      onUpdateWeight?.(editingRecord.id, data);
      setEditingRecord(null);
      toast({
        title: "Weight record updated",
        description: "The weight record has been successfully updated."
      });
    } else {
      onAddWeight?.(goat.id, data);
      setIsAddDialogOpen(false);
      toast({
        title: "Weight record added",
        description: "New weight record has been added successfully."
      });
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      notes: ''
    });
  };

  const handleEdit = (record: WeightRecord) => {
    setEditingRecord(record);
    setFormData({
      date: new Date(record.date).toISOString().split('T')[0],
      weight: record.weight.toString(),
      notes: record.notes || ''
    });
  };

  const handleDelete = (record: WeightRecord) => {
    if (window.confirm('Are you sure you want to delete this weight record?')) {
      onDeleteWeight?.(record.id);
      toast({
        title: "Weight record deleted",
        description: "The weight record has been deleted."
      });
    }
  };

  const WeightForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="0.0"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddDialogOpen(false);
            setEditingRecord(null);
            setFormData({
              date: new Date().toISOString().split('T')[0],
              weight: '',
              notes: ''
            });
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingRecord ? 'Update' : 'Add'} Weight
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Weight Tracking - {goat.name}</h3>
          <p className="text-sm text-muted-foreground">#{goat.tagNumber}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Weight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weight Record</DialogTitle>
            </DialogHeader>
            <WeightForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Weight Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Weight className="h-5 w-5" />
            <span>Weight Growth Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length >= 2 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} kg`, 'Weight']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Weight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add at least 2 weight records to see the growth chart</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Records List */}
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRecords.length > 0 ? (
            <div className="space-y-4">
              {sortedRecords.reverse().map((record, index) => {
                const previousRecord = sortedRecords[index + 1];
                const hasChange = previousRecord && record.weight !== previousRecord.weight;
                const weightChange = previousRecord ? record.weight - previousRecord.weight : 0;
                const TrendIcon = previousRecord ? getTrendIcon(record.weight, previousRecord.weight) : null;
                const trendColor = previousRecord ? getTrendColor(record.weight, previousRecord.weight) : '';

                return (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold">{record.weight} kg</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {hasChange && TrendIcon && (
                          <div className={`flex items-center space-x-1 ${trendColor}`}>
                            <TrendIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{record.notes}"
                        </p>
                      )}
                    </div>
                    
                    {(onUpdateWeight || onDeleteWeight) && (
                      <div className="flex space-x-2">
                        {onUpdateWeight && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteWeight && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Weight className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No weight records found</p>
              <p className="text-sm">Start tracking {goat.name}'s weight to monitor growth</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Weight Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Weight Record</DialogTitle>
          </DialogHeader>
          <WeightForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}