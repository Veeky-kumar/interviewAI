import { InterviewEvaluation } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

interface EvaluationPanelProps {
  evaluation: InterviewEvaluation;
}

const EvaluationPanel = ({ evaluation }: EvaluationPanelProps) => {
  const getRecommendationStyles = () => {
    switch (evaluation.recommendation) {
      case 'hire':
        return { 
          bg: 'bg-success/20', 
          text: 'text-success', 
          icon: ThumbsUp,
          label: 'Recommend Hire'
        };
      case 'consider':
        return { 
          bg: 'bg-warning/20', 
          text: 'text-warning', 
          icon: Minus,
          label: 'Consider Further'
        };
      case 'reject':
        return { 
          bg: 'bg-destructive/20', 
          text: 'text-destructive', 
          icon: ThumbsDown,
          label: 'Not Recommended'
        };
    }
  };

  const recStyles = getRecommendationStyles();
  const RecIcon = recStyles.icon;

  return (
    <div className="glass-strong rounded-2xl p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold text-foreground mb-6">Interview Evaluation</h2>

      {/* Recommendation */}
      <div className={`${recStyles.bg} rounded-xl p-4 mb-6 flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-full ${recStyles.bg} flex items-center justify-center`}>
          <RecIcon className={`h-6 w-6 ${recStyles.text}`} />
        </div>
        <div>
          <p className={`font-semibold ${recStyles.text} text-lg`}>{recStyles.label}</p>
          <p className="text-sm text-muted-foreground mt-1">{evaluation.summary}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Communication', score: evaluation.communicationScore },
          { label: 'Technical', score: evaluation.technicalScore },
          { label: 'Role Fit', score: evaluation.roleFitScore },
        ].map(({ label, score }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold text-gradient mb-1">{score}%</div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <Progress value={score} className="h-1 mt-2" />
          </div>
        ))}
      </div>

      {/* Strengths */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-success" />
          Strengths
        </h3>
        <ul className="space-y-1">
          {evaluation.strengths.map((strength, i) => (
            <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:bg-success before:rounded-full">
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-destructive" />
          Areas for Improvement
        </h3>
        <ul className="space-y-1">
          {evaluation.weaknesses.map((weakness, i) => (
            <li key={i} className="text-sm text-muted-foreground pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:w-1 before:h-1 before:bg-destructive before:rounded-full">
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      {/* Skill Gaps */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-warning" />
          Skill Gaps
        </h3>
        <div className="flex flex-wrap gap-2">
          {evaluation.skillGaps.map((gap, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {gap}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationPanel;
