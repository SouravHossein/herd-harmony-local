import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Trash, 
  Edit, 
  Plus, 
  Calendar,
  Tag,
  FileImage,
  Video,
  Download
} from 'lucide-react';
import { Goat, MediaFile } from '@/types/goat';
import { useToast } from '@/hooks/use-toast';

interface InteractiveMediaTabProps {
  goat: Goat;
  onAddMedia?: (goatId: string, files: File[], category: string, description?: string, tags?: string[]) => void;
  onUpdateMedia?: (mediaId: string, updates: Partial<MediaFile>) => void;
  onDeleteMedia?: (mediaId: string) => void;
}

interface MediaFormData {
  category: string;
  description: string;
  tags: string;
}

export function InteractiveMediaTab({ 
  goat, 
  onAddMedia, 
  onUpdateMedia, 
  onDeleteMedia 
}: InteractiveMediaTabProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [formData, setFormData] = useState<MediaFormData>({
    category: 'general',
    description: '',
    tags: ''
  });

  const mediaFiles = goat.mediaFiles || [];
  const imageFiles = mediaFiles.filter(f => f.type === 'image');
  const videoFiles = mediaFiles.filter(f => f.type === 'video');

  const categoryColors = {
    birth: 'bg-pink-100 text-pink-800',
    health: 'bg-red-100 text-red-800',
    growth: 'bg-green-100 text-green-800',
    breeding: 'bg-purple-100 text-purple-800',
    general: 'bg-blue-100 text-blue-800',
    milestone: 'bg-yellow-100 text-yellow-800',
    weaning: 'bg-orange-100 text-orange-800'
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    if (files.length > 0) {
      setIsUploadDialogOpen(true);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await onAddMedia?.(
        goat.id, 
        selectedFiles, 
        formData.category, 
        formData.description || undefined,
        tags.length > 0 ? tags : undefined
      );

      toast({
        title: "Media uploaded",
        description: `${selectedFiles.length} file(s) uploaded successfully.`
      });

      // Reset form
      setSelectedFiles([]);
      setFormData({
        category: 'general',
        description: '',
        tags: ''
      });
      setIsUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload media files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (media: MediaFile) => {
    setEditingMedia(media);
    setFormData({
      category: media.category,
      description: media.description || '',
      tags: media.tags.join(', ')
    });
  };

  const handleUpdate = async () => {
    if (!editingMedia) return;

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    await onUpdateMedia?.(editingMedia.id, {
      category: formData.category as any,
      description: formData.description || undefined,
      tags
    });

    toast({
      title: "Media updated",
      description: "Media information has been updated."
    });

    setEditingMedia(null);
    setFormData({
      category: 'general',
      description: '',
      tags: ''
    });
  };

  const handleDelete = async (media: MediaFile) => {
    if (window.confirm('Are you sure you want to delete this media file?')) {
      await onDeleteMedia?.(media.id);
      toast({
        title: "Media deleted",
        description: "The media file has been deleted."
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const MediaForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      {!isEdit && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files</Label>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center space-x-2">
                  {file.type.startsWith('image/') ? (
                    <FileImage className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Video className="h-4 w-4 text-purple-500" />
                  )}
                  <span className="text-sm">{file.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="birth">Birth</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="breeding">Breeding</SelectItem>
            <SelectItem value="milestone">Milestone</SelectItem>
            <SelectItem value="weaning">Weaning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what's happening in this media..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (optional)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="Enter tags separated by commas (e.g., milestone, cute, first day)"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsUploadDialogOpen(false);
            setEditingMedia(null);
            setSelectedFiles([]);
            setFormData({
              category: 'general',
              description: '',
              tags: ''
            });
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={isEdit ? handleUpdate : handleUpload}
          disabled={isUploading || (!isEdit && selectedFiles.length === 0)}
        >
          {isUploading ? 'Uploading...' : isEdit ? 'Update' : 'Upload'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Media Gallery - {goat.name}</h3>
          <p className="text-sm text-muted-foreground">#{goat.tagNumber}</p>
        </div>
        <div className="flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{mediaFiles.length}</p>
            <p className="text-xs text-muted-foreground">Total Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{imageFiles.length}</p>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{videoFiles.length}</p>
            <p className="text-xs text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Media Files</span>
            <Badge variant="outline">{mediaFiles.length} files</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mediaFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaFiles.map((media) => (
                <div key={media.id} className="border rounded-lg overflow-hidden">
                  {/* Media Preview */}
                  <div className="aspect-video bg-muted relative group">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.description || 'Goat media'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(media)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" asChild>
                        <a href={media.url} download={media.filename}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(media)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={categoryColors[media.category] || categoryColors.general}>
                        {media.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(media.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    {media.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {media.description}
                      </p>
                    )}

                    {media.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {media.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{media.filename}</span>
                      {media.fileSize && (
                        <span>{formatFileSize(media.fileSize)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No media files yet</p>
              <p className="text-sm">Upload photos and videos to track {goat.name}'s journey</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
          </DialogHeader>
          <MediaForm />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingMedia} onOpenChange={(open) => !open && setEditingMedia(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Information</DialogTitle>
          </DialogHeader>
          <MediaForm isEdit />
        </DialogContent>
      </Dialog>
    </div>
  );
}