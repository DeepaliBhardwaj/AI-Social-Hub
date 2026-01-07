import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  BarChart2, 
  Library, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/mode-toggle';
import { logout as authLogout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Import the generated icon
import appIcon from '@assets/generated_images/socialgen_app_icon.png';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useStore();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authLogout();
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setLocation('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Generator', icon: PenTool, href: '/generator' },
    { label: 'Scheduler', icon: Calendar, href: '/scheduler' },
    { label: 'Analytics', icon: BarChart2, href: '/analytics' },
    { label: 'Library', icon: Library, href: '/library' },
    { label: 'Profile', icon: Settings, href: '/profile' },
  ];

  return (
    <div className="min-h-screen flex bg-transparent font-sans text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 glass border-r border-border z-50">
        <div className="p-6 flex items-center gap-3">
          <img src={appIcon} alt="SocialGen" className="w-8 h-8 rounded-lg shadow-lg" />
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            SocialGen
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium shadow-sm border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-border">
          <ModeToggle />
          
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src={appIcon} alt="SocialGen" className="w-8 h-8 rounded-lg" />
          <span className="font-display font-bold text-lg">SocialGen</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-background/95 backdrop-blur-lg z-40 md:hidden p-4"
          >
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-lg transition-colors",
                      location === item.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-8 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
