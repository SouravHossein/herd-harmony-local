
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, Video, Eye, Calendar, Tag } from 'lucide-react';
import { Goat } from '@/types/goat';

interface GoatMediaGalleryProps {
  goat: Goat;
}

export default function GoatMediaGallery({ goat }: GoatMediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const images = goat.mediaFiles?.filter(m => m.type === 'image') || [];
  const videos = goat.mediaFiles?.filter(m => m.type === 'video') || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'birth': return 'bg-pink-100 text-pink-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'breeding': return 'bg-purple-100 text-purple-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMediaClick = (media: any) => {
    setSelectedMedia(media);
    setIsViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Media Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Camera className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{images.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Video className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{videos.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
      </div>

      {/* Photo Gallery */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Photos</span>
              <Badge variant="outline">{images.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((media) => (
                <div key={media.id} className="group relative aspect-square">
                  <img
                    src={media.url}
                    alt={media.filename}
                    className="w-full h-full object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleMediaClick(media)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 left-2 space-y-1">
                    <Badge variant="secondary" className={getCategoryColor(media.category)}>
                      {media.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white bg-black bg-opacity-50 rounded px-2 py-1 truncate">
                      {new Date(media.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Gallery */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Videos</span>
              <Badge variant="outline">{videos.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((media) => (
                <div key={media.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium truncate">{media.filename}</p>
                      <Badge variant="secondary" className={getCategoryColor(media.category)}>
                        {media.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(media.timestamp).toLocaleDateString()}
                    </p>
                    {media.description && (
                      <p className="text-sm text-muted-foreground mt-1">{media.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {images.length === 0 && videos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Camera className="w-12 h-12 text-muted-foreground opacity-50" />
              <Video className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
            <p className="text-lg font-medium text-muted-foreground mb-2">No media files</p>
            <p className="text-sm text-muted-foreground">
              Upload photos and videos to document {goat.name}'s journey
            </p>
          </CardContent>
        </Card>
      )}

      {/* Media Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          {selectedMedia && (
            <div className="space-y-4">
              <div className="aspect-video">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.filename}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{selectedMedia.filename}</h3>
                  <Badge className={getCategoryColor(selectedMedia.category)}>
                    {selectedMedia.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(selectedMedia.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                {selectedMedia.description && (
                  <p className="text-sm">{selectedMedia.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
