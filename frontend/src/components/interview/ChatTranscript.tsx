import { InterviewMessage } from '@/data/mockData';
import { Bot, User } from 'lucide-react';

interface ChatTranscriptProps {
  messages: InterviewMessage[];
}

const ChatTranscript = ({ messages }: ChatTranscriptProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${message.type === 'candidate' ? 'flex-row-reverse' : ''}`}
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.type === 'ai' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-accent/20 text-accent'
          }`}>
            {message.type === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          
          <div className={`flex flex-col gap-1 max-w-[80%] ${message.type === 'candidate' ? 'items-end' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 ${
              message.type === 'ai' 
                ? 'bg-secondary text-foreground rounded-tl-none' 
                : 'bg-primary/10 text-foreground rounded-tr-none'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <span className="text-xs text-muted-foreground px-2">{message.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatTranscript;
