import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border-primary/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Start hiring smarter today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your{' '}
            <span className="text-gradient">hiring process</span>?
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join forward-thinking companies using AI to find and hire the best talent faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="hero" size="lg" className="gap-2 group">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
