import React, { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';
import { Goat } from '@/types/goat';
import { PedigreeAI, InbreedingAnalysis } from '@/lib/pedigreeAI';
import ParentSelector from './ParentSelector';

interface PedigreeEditorProps {
  selectedGoat: Goat | null;
  goats: Goat[];
  onUpdateGoat: (id: string, updates: Partial<Goat>) => void;
}

export default function PedigreeEditor({ 
  selectedGoat, 
  goats, 
  onUpdateGoat 
}: PedigreeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingFatherId, setEditingFatherId] = useState<string | undefined>();
  const [editingMotherId, setEditingMotherId] = useState<string | undefined>();
  const [inbreedingAnalysis, setInbreedingAnalysis] = useState<InbreedingAnalysis | null>(null);

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

  const father = selectedGoat.fatherId ? goats.find(g => g.id === selectedGoat.fatherId) : null;
  const mother = selectedGoat.motherId ? goats.find(g => g.id === selectedGoat.motherId) : null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditingFatherId(selectedGoat.fatherId);
    setEditingMotherId(selectedGoat.motherId);
    setInbreedingAnalysis(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingFatherId(undefined);
    setEditingMotherId(undefined);
    setInbreedingAnalysis(null);
  };

  const handleSave = () => {
    const validation = PedigreeAI.validateParentage(
      selectedGoat,
      editingFatherId,
      editingMotherId,
      goats
    );

    if (!validation.isValid) {
      alert(`Cannot save changes: ${validation.errors.join(', ')}`);
      return;
    }

    onUpdateGoat(selectedGoat.id, {
      fatherId: editingFatherId,
      motherId: editingMotherId
    });

    setIsEditing(false);
    setEditingFatherId(undefined);
    setEditingMotherId(undefined);
    setInbreedingAnalysis(null);
  };

  const checkInbreeding = () => {
    if (editingFatherId && editingMotherId) {
      const analysis = PedigreeAI.calculateInbreedingCoefficient(
        editingFatherId,
        editingMotherId,
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
          <CardTitle className="text-lg">Pedigree Information</CardTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
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
              <ParentSelector
                goats={goats}
                selectedFatherId={editingFatherId}
                selectedMotherId={editingMotherId}
                onFatherChange={setEditingFatherId}
                onMotherChange={setEditingMotherId}
                excludeGoatId={selectedGoat.id}
              />

              {editingFatherId && editingMotherId && (
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