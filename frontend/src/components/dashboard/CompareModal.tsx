import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Candidate } from '@/data/mockData';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onRemoveCandidate: (id: string) => void;
}

const CompareModal = ({ isOpen, onClose, candidates, onRemoveCandidate }: CompareModalProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-primary';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getComparisonIcon = (current: number, other: number) => {
    if (current > other) return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (current < other) return <TrendingDown className="h-3 w-3 text-red-400" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const highestScore = Math.max(...candidates.map(c => c.matchScore));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Compare Candidates</DialogTitle>
        </DialogHeader>

        {candidates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No candidates selected for comparison
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(candidates.length, 3)}, 1fr)` }}>
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`glass rounded-xl p-4 relative ${
                  candidate.matchScore === highestScore ? 'ring-2 ring-primary' : ''
                }`}
              >
                {candidate.matchScore === highestScore && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Top Match
                  </Badge>
                )}
                
                <button
                  onClick={() => onRemoveCandidate(candidate.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="text-center mb-4 pt-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-2">
                    {candidate.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>

                {/* Match Score */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Match Score</span>
                    <div className="flex items-center gap-1">
                      <span className={`font-bold ${getScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                      </span>
                      {candidates.length > 1 && getComparisonIcon(
                        candidate.matchScore,
                        candidates.find(c => c.id !== candidate.id)?.matchScore || 0
                      )}
                    </div>
                  </div>
                  <Progress value={candidate.matchScore} className="h-2" />
                </div>

                {/* Experience */}
                <div className="mb-4 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground block mb-1">Experience</span>
                  <span className="font-medium text-foreground">{candidate.experience}</span>
                </div>

                {/* Education */}
                <div className="mb-4 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs text-muted-foreground block mb-1">Education</span>
                  <span className="text-sm text-foreground">{candidate.education}</span>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground block mb-2">Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{candidate.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="text-center text-sm text-muted-foreground">
                  📍 {candidate.location}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;
