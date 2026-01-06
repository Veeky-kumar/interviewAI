import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Calendar, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Candidate } from '@/data/mockData';

interface CandidateCardProps {
  candidate: Candidate;
  onScheduleInterview: (candidate: Candidate) => void;
  onViewCandidate: (candidateId: string) => void;
}

const CandidateCard = ({ candidate, onScheduleInterview, onViewCandidate }: CandidateCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusBadge = (status: Candidate['status']) => {
    const variants: Record<Candidate['status'], { label: string; className: string }> = {
      new: { label: 'New', className: 'bg-muted text-muted-foreground' },
      matched: { label: 'Matched', className: 'bg-primary/20 text-primary' },
      interview_scheduled: { label: 'Interview Scheduled', className: 'bg-accent/20 text-accent' },
      interview_completed: { label: 'Interview Completed', className: 'bg-success/20 text-success' },
      hired: { label: 'Hired', className: 'bg-success/30 text-success' },
      rejected: { label: 'Rejected', className: 'bg-destructive/20 text-destructive' },
    };
    const { label, className } = variants[status];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="glass rounded-xl p-5 hover-glow transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-semibold">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.experience} experience</p>
          </div>
        </div>
        {getStatusBadge(candidate.status)}
      </div>

      {/* Match Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Match Score</span>
          <span className={`font-bold ${getScoreColor(candidate.matchScore)}`}>
            {candidate.matchScore}%
          </span>
        </div>
        <Progress value={candidate.matchScore} className="h-2" />
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.slice(0, 4).map((skill, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {candidate.skills.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{candidate.skills.length - 4}
          </Badge>
        )}
      </div>

      {/* AI Explanation Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
      >
        <Sparkles className="h-4 w-4" />
        AI Match Explanation
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="bg-primary/5 rounded-lg p-3 mb-4 text-sm text-muted-foreground border border-primary/10">
          {candidate.aiExplanation}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {candidate.status === 'matched' && (
          <Button 
            size="sm" 
            onClick={() => onScheduleInterview(candidate)}
            className="flex-1 gap-2"
          >
            <Calendar className="h-4 w-4" />
            Schedule Interview
          </Button>
        )}
        {candidate.status === 'interview_scheduled' && (
          <Button 
            size="sm" 
            variant="success"
            onClick={() => window.location.href = `/interview/${candidate.id}`}
            className="flex-1 gap-2"
          >
            <User className="h-4 w-4" />
            Start AI Interview
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onViewCandidate(candidate.id)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;
