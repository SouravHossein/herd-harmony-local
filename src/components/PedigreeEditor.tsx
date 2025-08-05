import React, { useState, useReducer } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  Save, 
  X, 
  Users, 
  AlertCircle,
  Undo,
  Redo,
  RotateCcw
} from 'lucide-react';
import { Goat } from '@/types/goat';
import { PedigreeAI, InbreedingAnalysis } from '@/lib/pedigreeAI';
import EnhancedParentSelector from './EnhancedParentSelector';

interface PedigreeEditorProps {
  selectedGoat: Goat | null;
  goats: Goat[];
  onUpdateGoat: (id: string, updates: Partial<Goat>) => void;
}

// Action types for undo/redo functionality
type PedigreeAction = 
  | { type: 'SET_FATHER'; fatherId?: string }
  | { type: 'SET_MOTHER'; motherId?: string }
  | { type: 'SET_BOTH'; fatherId?: string; motherId?: string }
  | { type: 'RESET'; fatherId?: string; motherId?: string };

interface PedigreeState {
  fatherId?: string;
  motherId?: string;
}

interface HistoryState {
  past: PedigreeState[];
  present: PedigreeState;
  future: PedigreeState[];
}

// History reducer for undo/redo
const historyReducer = (state: HistoryState, action: { type: string; payload?: any }): HistoryState => {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };

    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };

    case 'UPDATE':
      if (action.payload.fatherId === present.fatherId && action.payload.motherId === present.motherId) {
        return state; // No change
      }
      return {
        past: [...past, present],
        present: action.payload,
        future: []
      };

    case 'RESET':
      return {
        past: [],
        present: action.payload,
        future: []
      };

    default:
      return state;
  }
};

export default function PedigreeEditor({ 
  selectedGoat, 
  goats, 
  onUpdateGoat 
}: PedigreeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inbreedingAnalysis, setInbreedingAnalysis] = useState<InbreedingAnalysis | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize history state
  const initialState: HistoryState = {
    past: [],
    present: {
      fatherId: selectedGoat?.fatherId,
      motherId: selectedGoat?.motherId
    },
    future: []
  };

  const [history, dispatchHistory] = useReducer(historyReducer, initialState);

  React.useEffect(() => {
    if (selectedGoat) {
      dispatchHistory({
        type: 'RESET',
        payload: {
          fatherId: selectedGoat.fatherId,
          motherId: selectedGoat.motherId
        }
      });
      setHasUnsavedChanges(false);
    }
  }, [selectedGoat]);

  React.useEffect(() => {
    // Check for unsaved changes
    if (selectedGoat) {
      const hasChanges = 
        history.present.fatherId !== selectedGoat.fatherId ||
        history.present.motherId !== selectedGoat.motherId;
      setHasUnsavedChanges(hasChanges);
    }
  }, [history.present, selectedGoat]);

  if (!selectedGoat) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a goat to edit its pedigree information</p>
        </CardContent>
      </Card>
    );
  }

  const father = history.present.fatherId ? goats.find(g => g.id === history.present.fatherId) : null;
  const mother = history.present.motherId ? goats.find(g => g.id === history.present.motherId) : null;

  const handleEdit = () => {
    setIsEditing(true);
    setInbreedingAnalysis(null);
  };

  const handleCancel = () => {
    // Reset to original values
    dispatchHistory({
      type: 'RESET',
      payload: {
        fatherId: selectedGoat.fatherId,
        motherId: selectedGoat.motherId
      }
    });
    setIsEditing(false);
    setInbreedingAnalysis(null);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    const validation = PedigreeAI.validateParentage(
      selectedGoat,
      history.present.fatherId,
      history.present.motherId,
      goats
    );

    if (!validation.isValid) {
      alert(`Cannot save changes: ${validation.errors.join(', ')}`);
      return;
    }

    onUpdateGoat(selectedGoat.id, {
      fatherId: history.present.fatherId,
      motherId: history.present.motherId
    });

    setIsEditing(false);
    setInbreedingAnalysis(null);
    setHasUnsavedChanges(false);
  };

  const handleFatherChange = (fatherId?: string) => {
    dispatchHistory({
      type: 'UPDATE',
      payload: {
        fatherId,
        motherId: history.present.motherId
      }
    });
  };

  const handleMotherChange = (motherId?: string) => {
    dispatchHistory({
      type: 'UPDATE',
      payload: {
        fatherId: history.present.fatherId,
        motherId
      }
    });
  };

  const handleUndo = () => {
    dispatchHistory({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatchHistory({ type: 'REDO' });
  };

  const checkInbreeding = () => {
    if (history.present.fatherId && history.present.motherId) {
      const analysis = PedigreeAI.calculateInbreedingCoefficient(
        history.present.fatherId,
        history.present.motherId,
        goats
      );
      setInbreedingAnalysis(analysis);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'extreme': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const insights = PedigreeAI.generatePedigreeInsights(selectedGoat, goats);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Pedigree Information</span>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                {/* Undo/Redo Controls */}
                <div className="flex gap-1 mr-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUndo}
                    disabled={history.past.length === 0}
                    title="Undo"
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRedo}
                    disabled={history.future.length === 0}
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      dispatchHistory({
                        type: 'RESET',
                        payload: {
                          fatherId: selectedGoat.fatherId,
                          motherId: selectedGoat.motherId
                        }
                      });
                    }}
                    disabled={!hasUnsavedChanges}
                    title="Reset to original"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Father (Sire)</h4>
                {father ? (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ♂ {father.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({father.tagNumber}) - {father.breed}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unknown Sire</span>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Mother (Dam)</h4>
                {mother ? (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                      ♀ {mother.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({mother.tagNumber}) - {mother.breed}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unknown Dam</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <EnhancedParentSelector
                goats={goats}
                selectedFatherId={history.present.fatherId}
                selectedMotherId={history.present.motherId}
                onFatherChange={handleFatherChange}
                onMotherChange={handleMotherChange}
                excludeGoatId={selectedGoat.id}
                showManualInput={true}
              />

              {history.present.fatherId && history.present.motherId && (
                <div className="flex justify-center">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={checkInbreeding}
                    className="text-xs"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Check Inbreeding Risk
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Debug Info (can be removed in production) */}
      {isEditing && (
        <Card className="border-dashed border-muted">
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">
              History: {history.past.length} past, {history.future.length} future
              {hasUnsavedChanges && " • Unsaved changes detected"}
            </div>
          </CardContent>
        </Card>
      )}

      {inbreedingAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Inbreeding Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inbreeding Coefficient:</span>
              <span className="text-lg font-bold">
                {(inbreedingAnalysis.coefficient * 100).toFixed(2)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level:</span>
              <Badge className={getRiskColor(inbreedingAnalysis.risk)}>
                {inbreedingAnalysis.risk.toUpperCase()}
              </Badge>
            </div>

            {inbreedingAnalysis.commonAncestors.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Common Ancestors:</p>
                <div className="flex flex-wrap gap-1">
                  {inbreedingAnalysis.commonAncestors.map(ancestorId => {
                    const ancestor = goats.find(g => g.id === ancestorId);
                    return ancestor ? (
                      <Badge key={ancestorId} variant="outline" className="text-xs">
                        {ancestor.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Recommendations:</p>
              {inbreedingAnalysis.recommendations.map((rec, index) => (
                <Alert key={index} className="py-2">
                  <AlertDescription className="text-xs">{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Pedigree Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <Alert key={index} className="py-2">
                  <AlertDescription className="text-xs">{insight}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
