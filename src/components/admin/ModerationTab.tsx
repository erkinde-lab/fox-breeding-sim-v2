import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Member, Report } from '@/lib/store/types';

interface ModerationTabProps {
  members: Member[];
  reports: Report[];
  onWarn: (id: string, reason: string) => void; // Updated signature
  onBan: (id: string) => void;
}

export const ModerationTab: React.FC<ModerationTabProps> = ({ members, reports, onWarn, onBan }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">No pending reports.</p>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{report.reporterName}</span>
                      <span className="text-xs text-muted-foreground">reported</span>
                      <span className="font-semibold">{report.targetId}</span>
                    </div>
                    <p className="text-sm mt-1">{report.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Dismiss</Button>
                    <Button variant="destructive" size="sm">Action</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${member.avatarColor}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{member.name}</span>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.isBanned && <Badge variant="destructive">Banned</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">Joined: {member.joined}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onWarn(member.id, "Staff Intervention")}>Warn</Button>
                  {!member.isBanned && (
                    <Button variant="destructive" size="sm" onClick={() => onBan(member.id)}>Ban</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
