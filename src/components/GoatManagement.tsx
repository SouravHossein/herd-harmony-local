import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Weight,
  Activity,
  Eye,
  Heart,
  Clock,
  Camera,
  Video,
  FileText,
  TrendingUp,
  MapPin,
  User,
  Baby,
  Stethoscope,
  Info,
  X
} from 'lucide-react';

// Mock data for demonstration
const mockGoats = [
  {
    id: '1',
    name: 'Bella',
    tagNumber: 'G001',
    breed: 'Nubian',
    gender: 'female',
    dateOfBirth: new Date('2022-03-15'),
    color: 'Brown and White',
    status: 'active',
    notes: 'Excellent milk producer, very gentle temperament',
    sire: 'Buck Charlie',
    dam: 'Doe Luna',
    birthWeight: 3.2,
    currentWeight: 55.4,
    location: 'Pasture A',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-12-01'),
    mediaFiles: [
      {
        id: 'm1',
        filename: 'bella_birth.jpg',
        type: 'image',
        url: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Bella+Birth',
        category: 'birth',
        timestamp: new Date('2022-03-15'),
        description: 'First day after birth'
      },
      {
        id: 'm2',
        filename: 'bella_6months.mp4',
        type: 'video',
        url: '#',
        category: 'milestone',
        timestamp: new Date('2022-09-15'),
        description: '6 months milestone'
      }
    ],
    healthRecords: [
      {
        id: 'h1',
        date: new Date('2024-01-15'),
        type: 'vaccination',
        description: 'CDT Vaccination',
        veterinarian: 'Dr. Smith'
      },
      {
        id: 'h2',
        date: new Date('2024-06-10'),
        type: 'checkup',
        description: 'Annual health checkup - all normal',
        veterinarian: 'Dr. Johnson'
      }
    ],
    weightHistory: [
      { date: new Date('2022-03-15'), weight: 3.2 },
      { date: new Date('2022-06-15'), weight: 18.5 },
      { date: new Date('2022-12-15'), weight: 35.2 },
      { date: new Date('2023-06-15'), weight: 48.7 },
      { date: new Date('2024-01-15'), weight: 52.1 },
      { date: new Date('2024-12-01'), weight: 55.4 }
    ]
  },
  {
    id: '2',
    name: 'Max',
    tagNumber: 'G002',
    breed: 'Boer',
    gender: 'male',
    dateOfBirth: new Date('2021-08-22'),
    color: 'White with Brown Head',
    status: 'active',
    notes: 'Strong breeding buck, good conformation',
    sire: 'Champion Buck',
    dam: 'Elite Doe',
    birthWeight: 4.1,
    currentWeight: 78.2,
    location: 'Buck Pen',
    createdAt: new Date('2021-08-22'),
    updatedAt: new Date('2024-11-28'),
    mediaFiles: [],
    healthRecords: [
      {
        id: 'h3',
        date: new Date('2024-03-20'),
        type: 'hoof_trim',
        description: 'Routine hoof trimming',
        veterinarian: 'Farm Staff'
      }
    ],
    weightHistory: [
      { date: new Date('2021-08-22'), weight: 4.1 },
      { date: new Date('2022-02-22'), weight: 25.3 },
      { date: new Date('2022-08-22'), weight: 45.8 },
      { date: new Date('2023-02-22'), weight: 62.4 },
      { date: new Date('2023-08-22'), weight: 71.6 },
      { date: new Date('2024-11-28'), weight: 78.2 }
    ]
  }
];

// Enhanced Goat Card Component
function EnhancedGoatCard({ goat, onView, onEdit, onDelete }) {
  const calculateAge = (birthDate) => {
    const now = new Date();
    const ageMs = now.getTime() - birthDate.getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHealthStatus = () => {
    const recentHealthRecord = goat.healthRecords?.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    const daysSinceLastCheck = recentHealthRecord 
      ? Math.floor((new Date().getTime() - recentHealthRecord.date.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    
    if (!recentHealthRecord) return { status: 'unknown', color: 'bg-gray-100 text-gray-800' };
    if (daysSinceLastCheck < 30) return { status: 'recent', color: 'bg-green-100 text-green-800' };
    if (daysSinceLastCheck < 90) return { status: 'due soon', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'overdue', color: 'bg-red-100 text-red-800' };
  };

  const healthStatus = getHealthStatus();

  return (
    <Card className="shadow-card hover:shadow-soft transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>{goat.name}</span>
              {goat.gender === 'female' && <Heart className="h-4 w-4 text-pink-500" />}
              {goat.gender === 'male' && <Activity className="h-4 w-4 text-blue-500" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tag #{goat.tagNumber}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={
                  goat.status === 'active' ? 'default' : 
                  goat.status === 'sold' ? 'secondary' : 'destructive'
                }
                className="text-xs"
              >
                {goat.status}
              </Badge>
              <Badge variant="outline" className={`text-xs ${healthStatus.color}`}>
                Health: {healthStatus.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{goat.location || 'Unassigned'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground">Breed</p>
              <p className="font-medium capitalize">{goat.breed}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium">{calculateAge(goat.dateOfBirth)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground">Color</p>
              <p className="font-medium capitalize">{goat.color}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Weight</p>
              <p className="font-medium">{goat.currentWeight} kg</p>
            </div>
          </div>
        </div>

        {/* Weight Trend Indicator */}
        {goat.weightHistory && goat.weightHistory.length > 1 && (
          <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              Weight trend: +{(goat.weightHistory[goat.weightHistory.length - 1].weight - goat.weightHistory[goat.weightHistory.length - 2].weight).toFixed(1)} kg
            </span>
          </div>
        )}

        {/* Media Count */}
        {goat.mediaFiles && goat.mediaFiles.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Camera className="h-3 w-3" />
              <span>{goat.mediaFiles.filter(m => m.type === 'image').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>{goat.mediaFiles.filter(m => m.type === 'video').length}</span>
            </div>
          </div>
        )}

        {/* Birth Info */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Born {formatDate(goat.dateOfBirth)}</span>
        </div>

        {/* Notes Preview */}
        {goat.notes && (
          <p className="text-sm text-muted-foreground bg-secondary p-2 rounded-lg line-clamp-2">
            {goat.notes}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(goat)}
            className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(goat)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(goat)}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Detailed Goat View Component
function DetailedGoatView({ goat, isOpen, onClose }) {
  const calculateAge = (birthDate) => {
    const now = new Date();
    const ageMs = now.getTime() - birthDate.getTime();
    const ageMonths = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44));
    
    if (ageMonths >= 12) {
      const years = Math.floor(ageMonths / 12);
      const remainingMonths = ageMonths % 12;
      return remainingMonths > 0 ? `${years} years ${remainingMonths} months` : `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!goat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {goat.gender === 'female' ? <Heart className="h-5 w-5 text-pink-500" /> : <Activity className="h-5 w-5 text-blue-500" />}
            <span>{goat.name} - Detailed View</span>
            <Badge variant="outline">Tag #{goat.tagNumber}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{goat.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tag Number</p>
                      <p className="font-medium">{goat.tagNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Breed</p>
                      <p className="font-medium capitalize">{goat.breed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{goat.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Color</p>
                      <p className="font-medium">{goat.color}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge 
                        variant={
                          goat.status === 'active' ? 'default' : 
                          goat.status === 'sold' ? 'secondary' : 'destructive'
                        }
                      >
                        {goat.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{goat.location || 'Unassigned'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Weight</p>
                      <p className="font-medium">{goat.currentWeight} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Age & Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Age & Important Dates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(goat.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Age</p>
                    <p className="font-medium">{calculateAge(goat.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Birth Weight</p>
                    <p className="font-medium">{goat.birthWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Added to Herd</p>
                    <p className="font-medium">{formatDate(goat.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(goat.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {goat.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{goat.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Health Records</span>
                  <Badge variant="outline">{goat.healthRecords?.length || 0} records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goat.healthRecords && goat.healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {goat.healthRecords.sort((a, b) => b.date.getTime() - a.date.getTime()).map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium capitalize">{record.type.replace('_', ' ')}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                          </div>
                          <Badge variant="outline">{record.veterinarian}</Badge>
                        </div>
                        <p className="text-sm">{record.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Stethoscope className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No health records found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Weight className="h-4 w-4" />
                  <span>Weight History</span>
                  <Badge variant="outline">{goat.weightHistory?.length || 0} records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goat.weightHistory && goat.weightHistory.length > 0 ? (
                  <div className="space-y-3">
                    {goat.weightHistory.sort((a, b) => b.date.getTime() - a.date.getTime()).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{record.weight} kg</p>
                          <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                        </div>
                        {index < goat.weightHistory.length - 1 && (
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              record.weight > goat.weightHistory[index + 1].weight 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {record.weight > goat.weightHistory[index + 1].weight ? '+' : ''}
                              {(record.weight - goat.weightHistory[index + 1].weight).toFixed(1)} kg
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Weight className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No weight records found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Media Files</span>
                  <Badge variant="outline">{goat.mediaFiles?.length || 0} files</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goat.mediaFiles && goat.mediaFiles.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {goat.mediaFiles.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((media) => (
                      <div key={media.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          {media.type === 'image' ? (
                            <img
                              src={media.url}
                              alt={media.filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Video className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium truncate">{media.filename}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(media.timestamp)}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {media.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No media files found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lineage" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sire (Father)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{goat.sire || 'Unknown'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Baby className="h-4 w-4" />
                    <span>Dam (Mother)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{goat.dam || 'Unknown'}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Main Goat Management Component
export default function GoatManagement() {
  const [goats] = useState(mockGoats);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedGoat, setSelectedGoat] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // Filter goats based on search and status
  const filteredGoats = goats.filter(goat => {
    const matchesSearch = goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || goat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewGoat = (goat) => {
    setSelectedGoat(goat);
    setIsDetailViewOpen(true);
  };

  const handleEditGoat = (goat) => {
    console.log('Edit goat:', goat);
    // Implement edit functionality
  };

  const handleDeleteGoat = (goat) => {
    if (confirm(`Are you sure you want to delete ${goat.name}? This action cannot be undone.`)) {
      console.log('Delete goat:', goat);
      // Implement delete functionality
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Goat Management</h2>
          <p className="text-muted-foreground">Manage your goat herd with detailed tracking</p>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Goat
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, tag number, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">{goats.filter(g => g.status === 'active').length}</h3>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-pink-600">{goats.filter(g => g.gender === 'female').length}</h3>
            <p className="text-sm text-muted-foreground">Does</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{goats.filter(g => g.gender === 'male').length}</h3>
            <p className="text-sm text-muted-foreground">Bucks</p>
          </CardContent>
        </Card>
      </div>

      {/* Goats Grid */}
      {filteredGoats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoats.map((goat) => (
            <EnhancedGoatCard
              key={goat.id}
              goat={goat}
              onView={handleViewGoat}
              onEdit={handleEditGoat}
              onDelete={handleDeleteGoat}
            />
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No goats found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start building your herd by adding your first goat.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goat
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Goat View Modal */}
      <DetailedGoatView
        goat={selectedGoat}
        isOpen={isDetailViewOpen}
        onClose={() => {
          setIsDetailViewOpen(false);
          setSelectedGoat(null);
        }}
      />
    </div>
  );
}
