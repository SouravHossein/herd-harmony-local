import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Goat } from '@/types/goat';
import { useGoatContext } from '@/context/GoatContext';
import { InteractiveGeneralTab } from '@/components/goats/InteractiveGeneralTab';
import { InteractiveWeightTab } from '@/components/goats/InteractiveWeightTab';
import { InteractiveHealthTab } from '@/components/goats/InteractiveHealthTab';
import { InteractiveBreedingTab } from '@/components/goats/InteractiveBreedingTab';
import { InteractiveMediaTab } from '@/components/goats/InteractiveMediaTab';
import { WeightRecord, HealthRecord, BreedingRecord } from '@/types/goat';

interface InteractiveGoatProfileProps {
  goat: Goat;
}

export function InteractiveGoatProfile({ goat: initialGoat }: InteractiveGoatProfileProps) {
  const [goat, setGoat] = useState<Goat>(initialGoat);
  const [activeTab, setActiveTab] = useState("general");
  const { 
    goats,
    weightRecords,
    healthRecords,
    breedingRecords,
    addGoat,
    updateGoat,
    deleteGoat,
    addWeightRecord,
    updateWeightRecord,
    deleteWeightRecord,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    addBreedingRecord,
    updateBreedingRecord,
    deleteBreedingRecord,
  } = useGoatContext();

  useEffect(() => {
    setGoat(initialGoat);
  }, [initialGoat]);

  const handleGoatUpdate = async (updates: Partial<Goat>) => {
    if (!goat.id) return;
    const updatedGoat = await updateGoat(goat.id, updates);
    if (updatedGoat) {
      setGoat(updatedGoat);
    }
  };

  const handleGoatDelete = async () => {
    if (!goat.id) return;
    const success = await deleteGoat(goat.id);
    if (success) {
      // Handle navigation or UI update after successful deletion
      alert('Goat deleted successfully');
    }
  };

  const handleAddWeight = async (goatId: string, data: any) => {
    await addWeightRecord({ ...data, goatId });
  };

  const handleUpdateWeight = async (recordId: string, data: any) => {
    await updateWeightRecord(recordId, data);
  };

  const handleDeleteWeight = async (recordId: string) => {
    await deleteWeightRecord(recordId);
  };

  const handleAddHealth = async (goatId: string, data: any) => {
    await addHealthRecord({ ...data, goatId });
  };

  const handleUpdateHealth = async (recordId: string, data: any) => {
    await updateHealthRecord(recordId, data);
  };

  const handleDeleteHealth = async (recordId: string) => {
    await deleteHealthRecord(recordId);
  };

  const handleAddBreeding = async (doeId: string, data: any) => {
    await addBreedingRecord({ ...data, doeId });
  };

  const handleUpdateBreeding = async (recordId: string, data: any) => {
    await updateBreedingRecord(recordId, data);
  };

  const handleDeleteBreeding = async (recordId: string) => {
    await deleteBreedingRecord(recordId);
  };

  const handleUpdateMedia = async (mediaUpdates: any) => {
    if (!goat.id) return;
    const updatedGoat = await updateGoat(goat.id, { mediaFiles: mediaUpdates });
    if (updatedGoat) {
      setGoat(updatedGoat);
    }
  };

  const allGoats = goats;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{goat.name}</h2>
          <p className="text-muted-foreground">#{goat.tagNumber}</p>
        </div>
        {/* Add any additional header elements here */}
      </div>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="breeding">Breeding</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <InteractiveGeneralTab
              goat={goat}
              onUpdate={handleGoatUpdate}
              onDelete={handleGoatDelete}
            />
          </TabsContent>

          <TabsContent value="weight">
            <InteractiveWeightTab
              goat={goat}
              weightRecords={weightRecords.filter(record => record.goatId === goat.id)}
              onAddWeight={handleAddWeight}
              onUpdateWeight={handleUpdateWeight}
              onDeleteWeight={handleDeleteWeight}
            />
          </TabsContent>

          <TabsContent value="health">
            <InteractiveHealthTab
              goat={goat}
              healthRecords={healthRecords.filter(record => record.goatId === goat.id)}
              onAddHealth={handleAddHealth}
              onUpdateHealth={handleUpdateHealth}
              onDeleteHealth={handleDeleteHealth}
            />
          </TabsContent>

          <TabsContent value="breeding">
            <InteractiveBreedingTab
              goat={goat}
              breedingRecords={breedingRecords.filter(record => record.doeId === goat.id)}
              allGoats={allGoats}
              onAddBreeding={handleAddBreeding}
              onUpdateBreeding={handleUpdateBreeding}
              onDeleteBreeding={handleDeleteBreeding}
            />
          </TabsContent>

          <TabsContent value="media">
            <InteractiveMediaTab
              goat={goat}
              onUpdateMedia={handleUpdateMedia}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
