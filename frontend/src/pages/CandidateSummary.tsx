import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Download, Calendar, FileText, CheckCircle, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import { mockCandidates, mockInterviewTranscript, mockEvaluation } from '@/data/mockData';

const CandidateSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const candidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];
  const hasInterview = candidate.status === 'interview_completed' || candidate.status === 'hired' || candidate.status === 'rejected';

  const timeline = [
    { 
      icon: FileText, 
      label: 'Resume Matched', 
      date: 'Jan 10, 2024', 
      completed: true,
      description: `Match score: ${candidate.matchScore}%`
    },
    { 
      icon: Calendar, 
      label: 'Interview Scheduled', 
      date: candidate.interviewDate ? new Date(candidate.interviewDate).toLocaleDateString() : 'Jan 12, 2024', 
      completed: candidate.status !== 'matched' && candidate.status !== 'new',
      description: 'AI Interview with role-specific questions'
    },
    { 
      icon: CheckCircle, 
      label: 'Interview Completed', 
      date: 'Jan 15, 2024', 
      completed: hasInterview,
      description: hasInterview ? `Recommendation: ${mockEvaluation.recommendation}` : 'Pending'
    },
  ];

  const handleExportPDF = () => {
    // Mock export - in real app would generate PDF
    alert('Exporting interview report as PDF...');
  };

  const handleExportCSV = () => {
    // Mock export - in real app would generate CSV
    alert('Exporting candidate summary as CSV...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container px-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6 gap-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl font-bold text-foreground mb-4">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h1 className="text-xl font-bold text-foreground">{candidate.name}</h1>
                  <p className="text-muted-foreground">{candidate.role}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{candidate.location}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-medium text-foreground mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Score */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-4">Match Score Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall Match</span>
                      <span className="font-medium text-primary">{candidate.matchScore}%</span>
                    </div>
                    <Progress value={candidate.matchScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Skills Match</span>
                      <span className="font-medium text-primary">{Math.min(candidate.matchScore + 5, 100)}%</span>
                    </div>
                    <Progress value={Math.min(candidate.matchScore + 5, 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Experience Match</span>
                      <span className="font-medium text-primary">{Math.max(candidate.matchScore - 3, 0)}%</span>
                    </div>
                    <Progress value={Math.max(candidate.matchScore - 3, 0)} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Export Actions */}
              <div className="glass rounded-2xl p-6">
                <h3 className="font-medium text-foreground mb-4">Export</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full gap-2" onClick={handleExportPDF}>
                    <Download className="h-4 w-4" />
                    Export Interview Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={handleExportCSV}>
                    <Download className="h-4 w-4" />
                    Export Summary (CSV)
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Summary */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Resume Summary
                </h2>
                <p className="text-muted-foreground leading-relaxed">{candidate.resumeSummary}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-semibold text-foreground">{candidate.experience}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Education</p>
                    <p className="font-semibold text-foreground">{candidate.education}</p>
                  </div>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="glass rounded-2xl p-6 border-primary/20">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  AI Match Analysis
                </h2>
                <p className="text-muted-foreground leading-relaxed">{candidate.aiExplanation}</p>
              </div>

              {/* Timeline */}
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Timeline
                </h2>
                <div className="space-y-6">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.completed ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                      }`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {item.label}
                          </h3>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Transcript (if completed) */}
              {hasInterview && (
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Interview Transcript</h2>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                    {mockInterviewTranscript.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'ai' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                        }`}>
                          {message.type === 'ai' ? 'AI' : candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {message.type === 'ai' ? 'AI Interviewer' : candidate.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateSummary;
