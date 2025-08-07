
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Goat, HealthRecord } from '@/types/goat';

interface GoatHealthHistoryProps {
  goat: Goat;
  healthRecords: HealthRecord[];
}

export default function GoatHealthHistory({ goat, healthRecords }: GoatHealthHistoryProps) {
  const sortedRecords = healthRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccination': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-red-100 text-red-800';
      case 'checkup': return 'bg-green-100 text-green-800';
      case 'deworming': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  // Group records by year/month
  const groupedRecords = sortedRecords.reduce((acc, record) => {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    
    if (!acc[key]) {
      acc[key] = { monthYear, records: [] };
    }
    acc[key].records.push(record);
    return acc;
  }, {} as Record<string, { monthYear: string; records: HealthRecord[] }>);

  return (
    <div className="space-y-6">
      {/* Health Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {healthRecords.filter(r => r.type === 'vaccination').length}
            </p>
            <p className="text-xs text-muted-foreground">Vaccinations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {healthRecords.filter(r => r.type === 'treatment').length}
            </p>
            <p className="text-xs text-muted-foreground">Treatments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {healthRecords.filter(r => r.type === 'checkup').length}
            </p>
            <p className="text-xs text-muted-foreground">Checkups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {healthRecords.filter(r => r.type === 'deworming').length}
            </p>
            <p className="text-xs text-muted-foreground">Dewormings</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Health Timeline</span>
            <Badge variant="outline">{healthRecords.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedRecords).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedRecords).map(([key, group]) => (
                <div key={key} className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{group.monthYear}</span>
                  </h4>
                  <div className="space-y-3 pl-6 border-l-2 border-muted">
                    {group.records.map((record) => (
                      <div key={record.id} className="bg-card border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getTypeColor(record.type)}>
                              {record.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(record.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(record.status)}
                                <span>{record.status || 'completed'}</span>
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <p className="font-medium mb-2">{record.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          {record.medicine && (
                            <p><span className="font-medium">Medicine:</span> {record.medicine}</p>
                          )}
                          {record.veterinarian && (
                            <p><span className="font-medium">Vet:</span> {record.veterinarian}</p>
                          )}
                        </div>
                        
                        {record.nextDueDate && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-sm">
                              <span className="font-medium">Next Due:</span> {new Date(record.nextDueDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-sm italic">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No health records found</p>
              <p className="text-sm">Start tracking {goat.name}'s health to maintain proper care</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
