import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Mic, MicOff, Video, VideoOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/layout/Navbar';
import AIOrb2D from '@/components/interview/AIOrb2D';
import ChatTranscript from '@/components/interview/ChatTranscript';
import EvaluationPanel from '@/components/interview/EvaluationPanel';
import { mockInterviewTranscript, mockEvaluation, mockCandidates, InterviewMessage } from '@/data/mockData';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orbState, setOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const messageIndexRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const candidate = mockCandidates.find(c => c.id === id) || mockCandidates[0];

  // Timer
  useEffect(() => {
    if (!isInterviewActive) return;
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isInterviewActive]);

  // Simulate interview progression
  useEffect(() => {
    if (!isInterviewActive || showEvaluation) return;

    const addNextMessage = () => {
      if (messageIndexRef.current < mockInterviewTranscript.length) {
        const nextMessage = mockInterviewTranscript[messageIndexRef.current];
        setMessages(prev => [...prev, nextMessage]);
        
        // Set orb state based on message type
        if (nextMessage.type === 'ai') {
          setOrbState('speaking');
          setTimeout(() => setOrbState('listening'), 2000);
        } else {
          setOrbState('listening');
        }
        
        messageIndexRef.current++;
      }
    };

    // Add first message immediately
    if (messageIndexRef.current === 0) {
      addNextMessage();
    }

    // Add subsequent messages
    const interval = setInterval(addNextMessage, 4000);

    return () => clearInterval(interval);
  }, [isInterviewActive, showEvaluation]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndInterview = () => {
    setIsInterviewActive(false);
    setOrbState('idle');
    setShowEvaluation(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Top Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 glass border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInterviewActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-sm font-medium text-foreground">
                {isInterviewActive ? 'Interview in Progress' : 'Interview Ended'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Interviewing: <span className="text-foreground font-medium">{candidate.name}</span>
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className={isMuted ? 'text-destructive' : ''}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={!isVideoOn ? 'text-destructive' : ''}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndInterview}
              disabled={!isInterviewActive}
              className="gap-2"
            >
              <Phone className="h-4 w-4" />
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-[7.5rem]">
        {showEvaluation ? (
          <div className="container px-4 py-8 max-w-3xl mx-auto">
            <EvaluationPanel evaluation={mockEvaluation} />
            <div className="flex gap-4 mt-6 justify-center">
              <Button variant="outline" onClick={() => navigate(`/candidate/${id}`)}>
                View Full Profile
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-7.5rem)] grid lg:grid-cols-2 gap-0">
            {/* Left Side - AI Orb */}
            <div className="relative bg-gradient-to-br from-background to-card flex items-center justify-center border-r border-border/50">
              <AIOrb2D state={orbState} />
            </div>

            {/* Right Side - Chat Transcript */}
            <div className="flex flex-col bg-card/50">
              <div className="p-4 border-b border-border/50">
                <h2 className="font-semibold text-foreground">Interview Transcript</h2>
                <p className="text-sm text-muted-foreground">Real-time conversation log</p>
              </div>
              
              <ScrollArea className="flex-1" ref={scrollRef}>
                <ChatTranscript messages={messages} />
              </ScrollArea>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Interview;
