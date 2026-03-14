import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, Diamond } from 'lucide-react';

interface EconomyTabProps {
  onUpdateCurrency: (gold: number, gems: number) => void;
}

export const EconomyTab: React.FC<EconomyTabProps> = ({ onUpdateCurrency }) => {
  const [gold, setGold] = useState(0);
  const [gems, setGems] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economy Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Add Gold</Label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
              <Input
                type="number"
                className="pl-9"
                value={gold}
                onChange={(e) => setGold(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Add Gems</Label>
            <div className="relative">
              <Diamond className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gems" />
              <Input
                type="number"
                className="pl-9"
                value={gems}
                onChange={(e) => setGems(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onUpdateCurrency(gold, gems)}>
          Inject Currency
        </Button>
      </CardFooter>
    </Card>
  );
};
