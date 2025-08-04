import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

interface ErrorNotificationProps {
  error: string;
  onDismiss: () => void;
}

export default function ErrorNotification({ error, onDismiss }: ErrorNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="pr-12">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="pr-6">
          {error}
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}