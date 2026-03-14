import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

interface DangerZoneTabProps {
  onResetGame: () => void;
}

export const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ onResetGame }) => {
  const [confirmText, setConfirmText] = useState("");
  const CONFIRM_STRING = "RESET ALL DATA";

  return (
    <Card className="border-destructive/50">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
          <p className="text-sm font-semibold text-destructive mb-2">Reset Game State</p>
          <p className="text-xs text-muted-foreground mb-4">
            This will permanently delete all foxes, user progress, and history. This action cannot be undone.
          </p>
          <div className="space-y-3">
            <p className="text-xs">Type <span className="font-bold text-destructive">"{CONFIRM_STRING}"</span> to confirm:</p>
            <Input
              placeholder={CONFIRM_STRING}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="border-destructive/30 focus-visible:ring-destructive"
            />
            <Button
              variant="destructive"
              className="w-full"
              disabled={confirmText !== CONFIRM_STRING}
              onClick={onResetGame}
            >
              Erase Everything
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
