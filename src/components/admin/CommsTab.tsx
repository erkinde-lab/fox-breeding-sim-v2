import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Megaphone } from 'lucide-react';

interface CommsTabProps {
  onSetBroadcast: (message: string) => void;
  onClearBroadcast: () => void;
}

export const CommsTab: React.FC<CommsTabProps> = ({ onSetBroadcast, onClearBroadcast }) => {
  const [msg, setMsg] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site-wide Communications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Broadcast Message</Label>
          <Textarea
            placeholder="Important announcement..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={() => onSetBroadcast(msg)}>
          <Megaphone className="w-4 h-4 mr-2" />
          Send Broadcast
        </Button>
        <Button variant="outline" onClick={onClearBroadcast}>Clear</Button>
      </CardFooter>
    </Card>
  );
};
