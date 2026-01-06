import { Brain, MessageSquare, BarChart3, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'RAG-Based Resume Matching',
    description: 'Semantic search powered by retrieval-augmented generation. Find candidates based on meaning, not just keywords.',
  },
  {
    icon: MessageSquare,
    title: 'AI Interviews',
    description: 'Automated interviews with intelligent question generation and real-time evaluation of candidate responses.',
  },
  {
    icon: BarChart3,
    title: 'Hiring Analytics',
    description: 'Comprehensive dashboards showing match distributions, interview outcomes, and hiring funnel metrics.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process thousands of resumes in seconds. Get ranked candidates with AI explanations instantly.',
  },
  {
    icon: Shield,
    title: 'Bias Reduction',
    description: 'AI-driven evaluation focuses on skills and qualifications, reducing unconscious bias in hiring.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share candidate insights, interview reports, and hiring decisions with your entire team.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for{' '}
            <span className="text-gradient">smarter hiring</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built for HR teams who want to find the best talent faster and more accurately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group glass rounded-2xl p-6 hover-glow transition-all duration-300 hover:border-primary/30"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
