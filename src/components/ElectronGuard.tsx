
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download } from "lucide-react";

interface ElectronGuardProps {
  children: React.ReactNode;
}

export default function ElectronGuard({ children }: ElectronGuardProps) {
  // Check if running in Electron environment
  if (!window.electronAPI?.isElectron) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <span>Desktop Application Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Environment Error</AlertTitle>
              <AlertDescription>
                This application requires the Electron desktop environment to function properly.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                The Goat Farm Management System is designed as a desktop application that provides:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Local database storage</li>
                <li>File system access for photos and backups</li>
                <li>Offline functionality</li>
                <li>System notifications</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">
                Please download and run the desktop application
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
