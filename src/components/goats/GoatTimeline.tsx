
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Timeline, 
  Calendar, 
  Weight, 
  Stethoscope, 
  Camera, 
  FileText,
  Baby
} from 'lucide-react';
import { Goat, WeightRecord, HealthRecord } from '@/types/goat';

interface GoatTimelineProps {
  goat: Goat;
  weightRecords: WeightRecord[];
  healthRecords: HealthRecord[];
}

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'birth' | 'weight' | 'health' | 'media' | 'note';
  icon: React.ReactNode;
  title: string;
  description: string;
  data?: any;
}

export default function GoatTimeline({ goat, weightRecords, healthRecords }: GoatTimelineProps) {
  // Combine all events into timeline
  const events: TimelineEvent[] = [];

  // Add birth event
  events.push({
    id: `birth-${goat.id}`,
    date: goat.dateOfBirth,
    type: 'birth',
    icon: <Baby className="h-4 w-4" />,
    title: 'Born',
    description: `${goat.name} was born${goat.birthWeight ? ` weighing ${goat.birthWeight} kg` : ''}`,
    data: { birthWeight: goat.birthWeight }
  });

  // Add weight records
  weightRecords.forEach(record => {
    events.push({
      id: record.id,
      date: record.date,
      type: 'weight',
      icon: <Weight className="h-4 w-4" />,
      title: 'Weight Recorded',
      description: `Weighed ${record.weight} kg${record.notes ? ` - ${record.notes}` : ''}`,
      data: record
    });
  });

  // Add health records
  healthRecords.forEach(record => {
    events.push({
      id: record.id,
      date: record.date,
      type: 'health',
      icon: <Stethoscope className="h-4 w-4" />,
      title: `Health: ${record.type.replace('_', ' ')}`,
      description: record.description,
      data: record
    });
  });

  // Add media events
  goat.mediaFiles?.forEach(media => {
    events.push({
      id: media.id,
      date: media.timestamp,
      type: 'media',
      icon: <Camera className="h-4 w-4" />,
      title: `${media.type === 'image' ? 'Photo' : 'Video'} Added`,
      description: `${media.category} - ${media.filename}${media.description ? ` - ${media.description}` : ''}`,
      data: media
    });
  });

  // Sort events by date (newest first)
  const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventColor = (type: string) => {
    switch (type) {
      case 'birth': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'weight': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'health': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-green-100 text-green-800 border-green-200';
      case 'note': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIconBg = (type: string) => {
    switch (type) {
      case 'birth': return 'bg-pink-500';
      case 'weight': return 'bg-blue-500';
      case 'health': return 'bg-red-500';
      case 'media': return 'bg-green-500';
      case 'note': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Timeline className="h-5 w-5" />
          <span>Life Timeline</span>
          <Badge variant="outline">{sortedEvents.length} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-4">
              {sortedEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getEventIconBg(event.type)} flex items-center justify-center text-white z-10`}>
                    {event.icon}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className={`p-4 rounded-lg border ${getEventColor(event.type)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{event.description}</p>
                      
                      {/* Additional data based on event type */}
                      {event.type === 'health' && event.data?.veterinarian && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Veterinarian:</span> {event.data.veterinarian}
                        </div>
                      )}
                      
                      {event.type === 'media' && event.data?.type === 'image' && (
                        <div className="mt-2">
                          <img
                            src={event.data.url}
                            alt={event.data.filename}
                            className="w-24 h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Timeline className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No timeline events found</p>
            <p className="text-sm">Events will appear here as you add records</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
