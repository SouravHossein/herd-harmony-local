import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Goat, PedigreeRecord } from '@/types/goat';
import { PedigreeAI, InbreedingAnalysis } from '@/lib/pedigreeAI';
import { Undo2, Redo2, Save, AlertTriangle, CheckCircle, Users, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdvancedPedigreeEditorProps {
  selectedGoat: Goat | null;
  goats: Goat[];
  onUpdateGoat: (id: string, updates: Partial<Goat>) => void;
}

interface PedigreeState {
  fatherId?: string;
  motherId?: string;
}

interface HistoryState {
  past: PedigreeState[];
  present: PedigreeState;
  future: PedigreeState[];
}

const historyReducer = (state: HistoryState, action: { type: string; payload?: any }): HistoryState => {
  switch (action.type) {
    case 'UNDO':
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    
    case 'REDO':
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    
    case 'UPDATE':
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    
    case 'RESET':
      return {
        past: [],
        present: action.payload,
        future: [],
      };
    
    default:
      return state;
  }
};

export function AdvancedPedigreeEditor({ selectedGoat, goats, onUpdateGoat }: AdvancedPedigreeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [inbreedingAnalysis, setInbreedingAnalysis] = useState<InbreedingAnalysis | null>(null);
  
  const [history, dispatch] = React.useReducer(historyReducer, {
    past: [],
    present: { 
      fatherId: selectedGoat?.fatherId, 
      motherId: selectedGoat?.motherId 
    },
    future: [],
  });

  useEffect(() => {
    if (selectedGoat) {
      dispatch({
        type: 'RESET',
        payload: { 
          fatherId: selectedGoat.fatherId, 
          motherId: selectedGoat.motherId 
        }
      });
      setHasUnsavedChanges(false);
      setIsEditing(false);
    }
  }, [selectedGoat]);

  const handleParentChange = (parentType: 'father' | 'mother', parentId: string | undefined) => {
    const newState = {
      ...history.present,
      [parentType === 'father' ? 'fatherId' : 'motherId']: parentId
    };
    
    dispatch({ type: 'UPDATE', payload: newState });
    setHasUnsavedChanges(true);

    // Run inbreeding analysis if both parents are selected
    if (newState.fatherId && newState.motherId) {
      const analysis = PedigreeAI.calculateInbreedingCoefficient(
        newState.fatherId,
        newState.motherId,
        goats
      );
      setInbreedingAnalysis(analysis);
    } else {
      setInbreedingAnalysis(null);
    }
  };

  const handleSave = () => {
    if (!selectedGoat) return;

    const validation = PedigreeAI.validateParentage(
      selectedGoat,
      history.present.fatherId,
      history.present.motherId,
      goats
    );

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }

    onUpdateGoat(selectedGoat.id, {
      fatherId: history.present.fatherId,
      motherId: history.present.motherId,
    });

    setHasUnsavedChanges(false);
    setIsEditing(false);
    
    toast({
      title: "Pedigree Updated",
      description: `Updated parentage for ${selectedGoat.name}`,
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'RESET',
      payload: { 
        fatherId: selectedGoat?.fatherId, 
        motherId: selectedGoat?.motherId 
      }
    });
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setInbreedingAnalysis(null);
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const eligibleFathers = goats.filter(g => 
    g.gender === 'male' && 
    g.id !== selectedGoat?.id &&
    g.status === 'active'
  );

  const eligibleMothers = goats.filter(g => 
    g.gender === 'female' && 
    g.id !== selectedGoat?.id &&
    g.status === 'active'
  );

  if (!selectedGoat) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goat Selected</h3>
          <p className="text-muted-foreground">
            Select a goat from the pedigree tree to edit its parentage
          </p>
        </CardContent>
      </Card>
    );
  }

  const insights = PedigreeAI.generatePedigreeInsights(selectedGoat, goats);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pedigree Editor - {selectedGoat.name}</span>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Parentage
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch({ type: 'UNDO' })}
                    disabled={!canUndo}
                  >
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch({ type: 'REDO' })}
                    disabled={!canRedo}
                  >
                    <Redo2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Father</label>
              {isEditing ? (
                <Select
                  value={history.present.fatherId || ''}
                  onValueChange={(value) => handleParentChange('father', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select father" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No father selected</SelectItem>
                    {eligibleFathers.map(goat => (
                      <SelectItem key={goat.id} value={goat.id}>
                        {goat.name} (#{goat.tagNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 border rounded">
                  {selectedGoat.fatherId ? (
                    <span>{goats.find(g => g.id === selectedGoat.fatherId)?.name || 'Unknown'}</span>
                  ) : (
                    <span className="text-muted-foreground">No father recorded</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mother</label>
              {isEditing ? (
                <Select
                  value={history.present.motherId || ''}
                  onValueChange={(value) => handleParentChange('mother', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mother" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No mother selected</SelectItem>
                    {eligibleMothers.map(goat => (
                      <SelectItem key={goat.id} value={goat.id}>
                        {goat.name} (#{goat.tagNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 border rounded">
                  {selectedGoat.motherId ? (
                    <span>{goats.find(g => g.id === selectedGoat.motherId)?.name || 'Unknown'}</span>
                  ) : (
                    <span className="text-muted-foreground">No mother recorded</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {inbreedingAnalysis && (
            <Alert className={
              inbreedingAnalysis.risk === 'extreme' ? 'border-red-500' :
              inbreedingAnalysis.risk === 'high' ? 'border-orange-500' :
              inbreedingAnalysis.risk === 'moderate' ? 'border-yellow-500' :
              'border-green-500'
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Inbreeding Analysis:</span>
                    <Badge variant={
                      inbreedingAnalysis.risk === 'extreme' ? 'destructive' :
                      inbreedingAnalysis.risk === 'high' ? 'destructive' :
                      inbreedingAnalysis.risk === 'moderate' ? 'secondary' :
                      'secondary'
                    }>
                      {inbreedingAnalysis.risk} risk
                    </Badge>
                  </div>
                  <p>Coefficient: {(inbreedingAnalysis.coefficient * 100).toFixed(2)}%</p>
                  {inbreedingAnalysis.commonAncestors.length > 0 && (
                    <p>Common ancestors: {inbreedingAnalysis.commonAncestors.length}</p>
                  )}
                  <div className="mt-2">
                    {inbreedingAnalysis.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm">• {rec}</p>
                    ))}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Pedigree Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <p key={index} className="text-sm">• {insight}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}