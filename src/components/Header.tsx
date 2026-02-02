import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LiveIndicator } from '@/components/ui/live-indicator';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { useCrowdStore } from '@/store/crowdStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LayoutDashboard, LogIn, LogOut, Shield, Map, BarChart3, Home } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const { isConnected, lastUpdate } = useCrowdStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/heatmap', label: 'Heatmap', icon: Map },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <AnimatedLogo size="sm" />
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          
          {isAuthenticated && (
            <Link to="/admin">
              <Button
                variant={isActive('/admin') ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LiveIndicator isConnected={isConnected} lastUpdate={lastUpdate} />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
