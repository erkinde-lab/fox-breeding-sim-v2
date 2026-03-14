import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fox } from '@/lib/store/types';

interface NPCKennelTabProps {
  npcStuds: Record<string, Fox>;
  onRepopulate: () => void;
}

export const NPCKennelTab: React.FC<NPCKennelTabProps> = ({ npcStuds, onRepopulate }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>NPC Stud Kennel</CardTitle>
        <Button onClick={onRepopulate}>Force Repopulate</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(npcStuds).map(stud => (
            <div key={stud.id} className="p-3 border rounded-lg flex justify-between items-center bg-muted/30">
              <div>
                <p className="font-bold">{stud.name}</p>
                <p className="text-xs text-muted-foreground">{stud.phenotype}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gold">{stud.studFee} Gold</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
