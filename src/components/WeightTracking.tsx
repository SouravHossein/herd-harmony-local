import React, { useState } from 'react';
import { useGoatContext } from '@/context/GoatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Plus, 
  Weight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Edit2,
  Trash2
} from 'lucide-react';

export function WeightTracking() {
  const { 
    goats, 
    weightRecords, 
    addWeightRecord, 
    updateWeightRecord, 
    deleteWeightRecord,
    getGoatWeightHistory 
  } = useGoatContext();
  const { toast } = useToast();
  const [selectedGoatId, setSelectedGoatId] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const activeGoats = goats.filter(goat => goat.status === 'active');
  const selectedGoat = goats.find(goat => goat.id === selectedGoatId);
  const weightHistory = selectedGoatId ? getGoatWeightHistory(selectedGoatId) : [];

  // Prepare chart data
  const chartData = weightHistory.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    weight: record.weight,
    fullDate: record.date
  }));

  // Calculate weight trends
  const getWeightTrend = (history: any[]) => {
    if (history.length < 2) return null;
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const change = latest.weight - previous.weight;
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const handleAddWeight = (formData: FormData) => {
    const weightData = {
      goatId: formData.get('goatId') as string,
      date: new Date(formData.get('date') as string),
      weight: parseFloat(formData.get('weight') as string),
      notes: formData.get('notes') as string,
    };

    addWeightRecord(weightData);
    setIsAddDialogOpen(false);
    
    const goat = goats.find(g => g.id === weightData.goatId);
    toast({
      title: "Weight Record Added",
      description: `Recorded ${weightData.weight}kg for ${goat?.name}`,
    });
  };

  const handleUpdateWeight = (formData: FormData) => {
    if (!editingRecord) return;

    const updates = {
      date: new Date(formData.get('date') as string),
      weight: parseFloat(formData.get('weight') as string),
      notes: formData.get('notes') as string,
    };

    updateWeightRecord(editingRecord.id, updates);
    setEditingRecord(null);
    toast({
      title: "Weight Record Updated",
      description: "The weight record has been updated successfully.",
    });
  };

  const handleDeleteWeight = (record: any) => {
    const goat = goats.find(g => g.id === record.goatId);
    if (confirm(`Are you sure you want to delete this weight record for ${goat?.name}?`)) {
      deleteWeightRecord(record.id);
      toast({
        title: "Weight Record Deleted",
        description: "The weight record has been removed.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Weight Tracking</h2>
          <p className="text-muted-foreground">Monitor and track goat weights over time</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:bg-primary-glow shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Weight Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weight Record</DialogTitle>
            </DialogHeader>
            <WeightForm onSubmit={handleAddWeight} goats={activeGoats} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Goat Selector */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Label htmlFor="goat-select" className="text-sm font-medium min-w-0">
              Select Goat:
            </Label>
            <div className="flex-1 min-w-0">
              <Select value={selectedGoatId} onValueChange={setSelectedGoatId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goat to view weight history" />
                </SelectTrigger>
                <SelectContent>
                  {activeGoats.map((goat) => (
                    <SelectItem key={goat.id} value={goat.id}>
                      {goat.name} (Tag #{goat.tagNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedGoat ? (
        <div className="space-y-6">
          {/* Weight Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Weight</p>
                    <p className="text-2xl font-bold text-foreground">
                      {weightHistory.length > 0 ? `${weightHistory[weightHistory.length - 1].weight} kg` : 'No data'}
                    </p>
                  </div>
                  <Weight className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weight Trend</p>
                    {(() => {
                      const trend = getWeightTrend(weightHistory);
                      if (!trend) return <p className="text-2xl font-bold text-muted-foreground">No trend</p>;
                      
                      return (
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-foreground">
                            {trend.direction === 'stable' ? '0' : `±${trend.change}`} kg
                          </p>
                          {trend.direction === 'up' && <TrendingUp className="h-5 w-5 text-success" />}
                          {trend.direction === 'down' && <TrendingDown className="h-5 w-5 text-destructive" />}
                          {trend.direction === 'stable' && <Minus className="h-5 w-5 text-muted-foreground" />}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                    <p className="text-2xl font-bold text-foreground">{weightHistory.length}</p>
                  </div>
                  <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">#</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weight Chart */}
          {chartData.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Weight History for {selectedGoat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weight Records Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Weight Records for {selectedGoat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {weightHistory.length > 0 ? (
                <div className="space-y-3">
                  {weightHistory.slice().reverse().map((record, index) => {
                    const isLatest = index === 0;
                    return (
                      <div 
                        key={record.id} 
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-semibold">
                              {record.weight} kg
                            </div>
                            {isLatest && (
                              <Badge variant="default" className="text-xs">Latest</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(record.date)}
                          </div>
                          {record.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {record.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingRecord(record)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteWeight(record)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Weight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No weight records for this goat yet.</p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="mt-4 bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Weight Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Weight className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Select a Goat</h3>
            <p className="text-muted-foreground">
              Choose a goat from the dropdown above to view their weight tracking history.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      {editingRecord && (
        <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Weight Record</DialogTitle>
            </DialogHeader>
            <WeightForm 
              onSubmit={handleUpdateWeight} 
              goats={activeGoats}
              initialData={editingRecord}
              isEditing 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface WeightFormProps {
  onSubmit: (formData: FormData) => void;
  goats: any[];
  initialData?: any;
  isEditing?: boolean;
}

function WeightForm({ onSubmit, goats, initialData, isEditing = false }: WeightFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="goatId">Goat *</Label>
          <Select name="goatId" defaultValue={initialData?.goatId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a goat" />
            </SelectTrigger>
            <SelectContent>
              {goats.map((goat) => (
                <SelectItem key={goat.id} value={goat.id}>
                  {goat.name} (Tag #{goat.tagNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input 
            id="date" 
            name="date" 
            type="date"
            defaultValue={initialData?.date ? 
              new Date(initialData.date).toISOString().split('T')[0] : 
              new Date().toISOString().split('T')[0]
            }
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input 
            id="weight" 
            name="weight" 
            type="number"
            step="0.1"
            min="0"
            defaultValue={initialData?.weight}
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          placeholder="Additional notes about this weight measurement..."
          defaultValue={initialData?.notes}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-gradient-primary">
          {isEditing ? 'Update Record' : 'Add Weight Record'}
        </Button>
      </div>
    </form>
  );
}