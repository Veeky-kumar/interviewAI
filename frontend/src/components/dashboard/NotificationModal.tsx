import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Candidate } from '@/data/mockData';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  interviewDate?: Date;
  interviewTime?: string;
}

const NotificationModal = ({ isOpen, onClose, candidate, interviewDate, interviewTime }: NotificationModalProps) => {
  const [sent, setSent] = useState(false);
  
  const defaultSubject = candidate && interviewDate
    ? `Interview Scheduled - ${candidate.role}`
    : 'Interview Invitation';
  
  const defaultBody = candidate && interviewDate && interviewTime
    ? `Dear ${candidate.name},

We are pleased to invite you to an interview for the ${candidate.role} position.

Interview Details:
• Date: ${interviewDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
• Time: ${interviewTime}
• Format: AI-Powered Video Interview

Please click the link below to join your interview session at the scheduled time:
[Interview Link]

What to expect:
• The interview will be conducted by our AI interviewer
• Duration: approximately 30-45 minutes
• Technical and behavioral questions relevant to the role

Please let us know if you need to reschedule.

Best regards,
The Hiring Team`
    : '';

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            Send Interview Notification
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Notification Sent!</h3>
            <p className="text-muted-foreground">
              {candidate.name} has been notified about the interview.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To
              </label>
              <Input
                value={candidate.email}
                disabled
                className="bg-muted/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSend} className="flex-1 gap-2">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
