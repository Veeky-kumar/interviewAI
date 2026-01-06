import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Brain, FileText, Loader2, Plus, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import CandidateCard from '@/components/dashboard/CandidateCard';
import ScheduleModal from '@/components/dashboard/ScheduleModal';
import JobCreationModal from '@/components/dashboard/JobCreationModal';
import CompareModal from '@/components/dashboard/CompareModal';
import NotificationModal from '@/components/dashboard/NotificationModal';
import { mockJobs, mockCandidates, Candidate, Job } from '@/data/mockData';
import { runResumeMatch } from '@/api/match.ts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [jobCreationOpen, setJobCreationOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState<string>('');

  // const handleSearch = async () => {
  //   if (!jobDescription.trim()) {
  //     toast({
  //       title: 'Job description required',
  //       description: 'Please paste a job description to run AI matching.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   setIsSearching(true);
  //   // Simulate AI processing
  //   await new Promise(resolve => setTimeout(resolve, 2000));
    
  //   // Filter and sort mock candidates
  //   const filteredCandidates = mockCandidates
  //     .filter(c => selectedJob ? c.role.toLowerCase().includes(mockJobs.find(j => j.id === selectedJob)?.title.toLowerCase().split(' ')[0] || '') : true)
  //     .sort((a, b) => b.matchScore - a.matchScore);
    
  //   setCandidates(filteredCandidates.length > 0 ? filteredCandidates : mockCandidates.slice(0, 4));
  //   setHasSearched(true);
  //   setIsSearching(false);

  //   toast({
  //     title: 'AI Matching Complete',
  //     description: `Found ${filteredCandidates.length || 4} matching candidates.`,
  //   });
  // };

  const handleSearch = async () => {
  if (!jobDescription.trim()) {
    toast({
      title: "Job description required",
      description: "Please paste a job description to run AI matching.",
      variant: "destructive",
    });
    return;
  }

  setIsSearching(true);

  try {
    const jobId = selectedJob || "adhoc_job";

    const data = await runResumeMatch(jobId, jobDescription);
console.log("dashborad data:",data);
    // Map backend → frontend Candidate type
const mappedCandidates: Candidate[] = data.top_matches.map((r, index) => ({
  id: r.resume_id,

  name:r.name || `Candidate ${index + 1}`,
  role: selectedJob
    ? jobs.find(j => j.id === selectedJob)?.title || "Unknown Role"
    : "Unknown Role",

  matchScore: r.match_score, // backend is 0–10, UI expects %

  summary: r.explanation.slice(0, 160) + "...",

  skills: r.matched_sections ?? ["General"],
  experience: "Experience details available after interview",
  education: "Education details available after interview",

  email: "",
  phone: "",
  location: "",

  aiExplanation: r.explanation,
  resumeSummary: r.explanation,

  status: "matched",
}));


    setCandidates(mappedCandidates);
    setHasSearched(true);

    toast({
      title: "AI Matching Complete",
      description: `Found ${mappedCandidates.length} matching candidates.`,
    });
  } catch (err: any) {
    toast({
      title: "Matching failed",
      description: err.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsSearching(false);
  }
};

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = (date: Date, time: string) => {
    if (selectedCandidate) {
      setCandidates(prev => 
        prev.map(c => 
          c.id === selectedCandidate.id 
            ? { ...c, status: 'interview_scheduled' as const, interviewDate: date.toISOString() }
            : c
        )
      );
      
      setScheduledDate(date);
      setScheduledTime(time);
      setScheduleModalOpen(false);
      setNotificationOpen(true);
    }
  };

  const handleCreateJob = (jobData: Omit<Job, 'id' | 'candidates'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      candidates: 0,
    };
    setJobs([...jobs, newJob]);
    toast({
      title: 'Job Created',
      description: `${jobData.title} has been created successfully.`,
    });
  };

  const toggleCompareCandidate = (candidateId: string) => {
    setSelectedForCompare(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : prev.length < 3 ? [...prev, candidateId] : prev
    );
  };

  const candidatesForCompare = candidates.filter(c => selectedForCompare.includes(c.id));

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/candidate/${candidateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Resume Matcher</h1>
            <p className="text-muted-foreground">
              Use RAG-based semantic search to find the best candidates for your role.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Input Panel */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">AI Input Panel</h2>
                </div>

                {/* Job Selector with Create Button */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Select Job Role (Optional)
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setJobCreationOpen(true)}
                      className="gap-1 text-xs h-7"
                    >
                      <Plus className="h-3 w-3" />
                      New Job
                    </Button>
                  </div>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a job role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{job.title}</span>
                            <span className="text-muted-foreground text-xs ml-4">
                              {job.candidates} candidates
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Paste Job Description
                  </label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here. The AI will semantically match resumes based on skills, experience, and role requirements..."
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {/* Search Button */}
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Running AI Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Run AI Resume Match
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Semantic RAG-based search over all resumes — not keyword matching
                </p>
              </div>

              {/* Info Box */}
              <div className="glass rounded-xl p-4 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm mb-1">How it works</h3>
                    <p className="text-xs text-muted-foreground">
                      Our AI uses Retrieval Augmented Generation (RAG) to understand the semantic meaning of your job description and match it against candidate profiles, going beyond simple keyword matching.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results Panel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {hasSearched ? 'Matched Candidates' : 'Results'}
                </h2>
                <div className="flex items-center gap-2">
                  {selectedForCompare.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCompareOpen(true)}
                      className="gap-1"
                    >
                      <GitCompare className="h-4 w-4" />
                      Compare ({selectedForCompare.length})
                    </Button>
                  )}
                  {hasSearched && (
                    <span className="text-sm text-muted-foreground">
                      {candidates.length} found
                    </span>
                  )}
                </div>
              </div>

              {!hasSearched ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Ready to find matches
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Paste a job description and run AI matching to see ranked candidates here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map((candidate, index) => (
                    <div 
                      key={candidate.id}
                      className="animate-slide-in-right"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                          <Checkbox
                            checked={selectedForCompare.includes(candidate.id)}
                            onCheckedChange={() => toggleCompareCandidate(candidate.id)}
                            className="bg-background/80"
                          />
                        </div>
                        <CandidateCard
                          candidate={candidate}
                          onScheduleInterview={handleScheduleInterview}
                          onViewCandidate={handleViewCandidate}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      {selectedCandidate && (
        <ScheduleModal
          candidate={selectedCandidate}
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setSelectedCandidate(null);
          }}
          onConfirm={handleConfirmSchedule}
        />
      )}

      {/* Job Creation Modal */}
      <JobCreationModal
        isOpen={jobCreationOpen}
        onClose={() => setJobCreationOpen(false)}
        onSubmit={handleCreateJob}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        candidates={candidatesForCompare}
        onRemoveCandidate={(id) => setSelectedForCompare(prev => prev.filter(cId => cId !== id))}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => {
          setNotificationOpen(false);
          setSelectedCandidate(null);
          toast({
            title: 'Interview Scheduled',
            description: `Interview scheduled successfully.`,
          });
        }}
        candidate={selectedCandidate}
        interviewDate={scheduledDate}
        interviewTime={scheduledTime}
      />
    </div>
  );
};

export default Dashboard;
