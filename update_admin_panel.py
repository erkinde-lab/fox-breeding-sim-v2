import re

with open('src/app/admin/page.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
if 'Flag' not in content:
    content = content.replace('AlertTriangle\n} from \'lucide-react\';', 'AlertTriangle, Flag, Eye, EyeOff, CheckCircle\n} from \'lucide-react\';')

# 2. Update useGameStore destructuring
content = content.replace('    hiredNutritionist,', '    hiredNutritionist,\n    reports,\n    currentMemberId,\n    resolveReport,')

# 3. Access control update
access_logic = """
  const currentMember = members.find(m => m.id === currentMemberId);
  const userRole = currentMember?.role || 'player';
  const isSuperAdmin = userRole === 'administrator' || isAdmin;
  const isStaff = userRole === 'administrator' || userRole === 'moderator' || isAdmin;

  if (!isStaff && process.env.NODE_ENV !== 'development') {
    return (
      <div className="py-20 text-center space-y-4">
        <Shield size={48} className="mx-auto text-destructive" />
        <h1 className="text-4xl font-black text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to access the Command Center.</p>
        <Button onClick={() => router.push('/')} variant="outline" className="rounded-xl font-black uppercase tracking-widest">Return Home</Button>
      </div>
    );
  }
"""
content = re.sub(r'const hasAccess = isAdmin \|\| process\.env\.NODE_ENV === \'development\';',
                 access_logic, content, flags=re.DOTALL)

# 4. Filter Tabs based on role
tabs_list = """
          <TabsList className="w-full flex flex-wrap gap-2 h-auto bg-transparent border-none p-0">
            {isSuperAdmin && <TabsTrigger value="site" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Settings size={14} /> Site</TabsTrigger>}
            <TabsTrigger value="reports" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all relative">
              <Flag size={14} /> Reports
              {reports.filter(r => r.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[8px] flex items-center justify-center rounded-full animate-bounce">
                  {reports.filter(r => r.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="news" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Megaphone size={14} /> News</TabsTrigger>
            <TabsTrigger value="members" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Users size={14} /> Members</TabsTrigger>
            <TabsTrigger value="forum" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><MessageSquare size={14} /> Forum</TabsTrigger>
            {isSuperAdmin && (
              <>
                <TabsTrigger value="economy" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Coins size={14} /> Economy</TabsTrigger>
                <TabsTrigger value="game" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Database size={14} /> Game</TabsTrigger>
                <TabsTrigger value="analytics" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><TrendingUp size={14} /> Stats</TabsTrigger>
                <TabsTrigger value="kennel" className="flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-4 data-[state=active]:border-primary rounded-xl transition-all"><Shield size={14} /> Kennel</TabsTrigger>
              </>
            )}
          </TabsList>
"""
content = re.sub(r'<TabsList className="w-full flex flex-wrap gap-2 h-auto bg-transparent border-none p-0">.*?</TabsList>',
                 tabs_list, content, flags=re.DOTALL)

# 5. Add Reports Tab Content
reports_content = """
        {/* Reports Management */}
        <TabsContent value="reports" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-folksy text-foreground tracking-tight" style={{ fontWeight: 400 }}>
                Pending Reports ({reports.filter(r => r.status === 'pending').length})
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reports.filter(r => r.status === 'pending').map((report) => {
                const reporter = members.find(m => m.id === report.reporterId);
                const target = report.type === 'member' ? members.find(m => m.id === report.targetId) : null;

                return (
                  <Card key={report.id} className="folk-card border-2 border-border shadow-sm overflow-hidden bg-card">
                    <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-destructive/10 border-destructive/20 text-destructive text-[10px] uppercase tracking-widest font-black">
                            {report.type} Report
                          </Badge>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            ID: {report.id} • {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-foreground">
                          {report.type === 'member' && `Reported User: ${target?.name || 'Unknown'}`}
                          {report.type === 'post' && `Reported Post: ${report.targetId}`}
                          {report.type === 'reply' && `Reported Reply: ${report.targetId}`}
                        </h4>
                        <div className="p-3 bg-muted/50 rounded-xl border border-border">
                          <p className="text-sm font-bold text-foreground">Reason: <span className="font-medium text-muted-foreground">{report.reason}</span></p>
                        </div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          Reporter: <span className="text-primary">{reporter?.name || 'Anonymous'}</span>
                        </p>
                      </div>

                      <div className="flex flex-row md:flex-col gap-2 justify-center">
                        <Button
                          onClick={() => {
                            if (report.type === 'member' && target) {
                              const reason = prompt("Enter warning reason:");
                              if (reason) {
                                warnMember(target.id, reason);
                                resolveReport(report.id, 'resolved');
                                addNotification(`Member ${target.name} warned and report resolved.`, "success");
                              }
                            } else {
                              resolveReport(report.id, 'resolved');
                              addNotification("Report marked as resolved.", "success");
                            }
                          }}
                          className="bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest gap-2"
                        >
                          <CheckCircle size={14} /> Resolve & Warn
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            resolveReport(report.id, 'dismissed');
                            addNotification("Report dismissed.", "info");
                          }}
                          className="text-[10px] font-black uppercase tracking-widest gap-2"
                        >
                          <Trash2 size={14} /> Dismiss
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {reports.filter(r => r.status === 'pending').length === 0 && (
                <div className="text-center py-20 bg-muted/30 border-2 border-dashed border-border rounded-[40px]">
                  <Shield size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-xl font-black italic text-muted-foreground/50">No pending reports. Everything is quiet...</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
"""
content = content.replace('{/* Site Management */}', reports_content + '{/* Site Management %}')

# 6. Restrict IP visibility in Members tab
content = content.replace(
    '<td>{member.ipHistory?.[0] || \'N/A\'}</td>',
    '<td>{isSuperAdmin ? (member.ipHistory?.[0] || \'N/A\') : \'[HIDDEN]\'}</td>'
)

# 7. Update TabsContent Site Management value to reflect the changed placement
content = content.replace('{/* Site Management %}', '{/* Site Management */}')

with open('src/app/admin/page.tsx', 'w') as f:
    f.write(content)
