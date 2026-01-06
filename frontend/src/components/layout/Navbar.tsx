import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, BarChart3, Users, Sparkles, Settings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Interview<span className="text-gradient">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {!isLanding && (
            <>
              <Link to="/dashboard">
                <Button
                  variant={location.pathname === '/dashboard' ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Resume Matcher
                </Button>
              </Link>
              <Link to="/analytics">
                <Button
                  variant={location.pathname === '/analytics' ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              <Link to="/settings">
                <Button
                  variant={location.pathname === '/settings' ? 'secondary' : 'ghost'}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLanding ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="hero" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                A
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
