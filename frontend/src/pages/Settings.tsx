import { useState } from 'react';
import { 
  Building2, 
  Users, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Plus,
  Mail,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
}

const Settings = () => {
  const { toast } = useToast();
  
  // Company profile state
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [companyWebsite, setCompanyWebsite] = useState('https://acme.com');
  const [companyDescription, setCompanyDescription] = useState('We are a leading technology company focused on AI-powered solutions.');
  
  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', email: 'john@acme.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@acme.com', role: 'recruiter' },
    { id: '3', name: 'Bob Wilson', email: 'bob@acme.com', role: 'viewer' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    interviewScheduled: true,
    interviewCompleted: true,
    candidateMatched: true,
    weeklyDigest: false,
    emailNotifications: true,
  });

  const handleSaveCompany = () => {
    toast({
      title: 'Settings Saved',
      description: 'Company profile has been updated successfully.',
    });
  };

  const handleInviteMember = () => {
    if (newMemberEmail.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: 'viewer',
      };
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail('');
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${newMemberEmail}`,
      });
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({
      title: 'Member Removed',
      description: 'Team member has been removed.',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'recruiter': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your company profile, team, and preferences.
            </p>
          </div>

          <Tabs defaultValue="company" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="company" className="gap-2">
                <Building2 className="h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Company Profile Tab */}
            <TabsContent value="company">
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Company Profile</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Website
                  </label>
                  <Input
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl">
                      A
                    </div>
                    <Button variant="secondary">Upload Logo</Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button onClick={handleSaveCompany} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                  </div>
                  <Badge variant="secondary">{teamMembers.length} members</Badge>
                </div>

                {/* Invite Member */}
                <div className="flex gap-3">
                  <Input
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter email to invite..."
                    className="flex-1"
                  />
                  <Button onClick={handleInviteMember} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Invite
                  </Button>
                </div>

                {/* Team List */}
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {member.role}
                        </Badge>
                        {member.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Interview Scheduled</p>
                      <p className="text-sm text-muted-foreground">Get notified when an interview is scheduled</p>
                    </div>
                    <Switch
                      checked={notifications.interviewScheduled}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, interviewScheduled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Interview Completed</p>
                      <p className="text-sm text-muted-foreground">Get notified when an interview is completed</p>
                    </div>
                    <Switch
                      checked={notifications.interviewCompleted}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, interviewCompleted: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Candidate Matched</p>
                      <p className="text-sm text-muted-foreground">Get notified when AI finds a strong match</p>
                    </div>
                    <Switch
                      checked={notifications.candidateMatched}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, candidateMatched: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of hiring activities</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button onClick={() => toast({ title: 'Preferences Saved' })} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Theme
                    </label>
                    <div className="flex gap-3">
                      <button className="flex-1 p-4 rounded-xl bg-zinc-900 border-2 border-primary text-foreground text-sm font-medium">
                        Dark
                      </button>
                      <button className="flex-1 p-4 rounded-xl bg-zinc-800 border border-border/50 text-muted-foreground text-sm font-medium opacity-50 cursor-not-allowed">
                        Light (Coming Soon)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Accent Color
                    </label>
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-cyan-500 ring-2 ring-offset-2 ring-offset-background ring-cyan-500" />
                      <button className="w-10 h-10 rounded-full bg-violet-500 opacity-50" />
                      <button className="w-10 h-10 rounded-full bg-emerald-500 opacity-50" />
                      <button className="w-10 h-10 rounded-full bg-orange-500 opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">More colors coming soon</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground text-sm">Security</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    All data is encrypted and stored securely.
                  </p>
                  <Button variant="secondary" size="sm">
                    View Security Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
