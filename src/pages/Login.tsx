import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, Lock, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        });
        navigate('/admin');
      } else {
        setError('Invalid email or password. Try: admin@crowdsense.io / admin123');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight">
                Crowd<span className="text-primary">Sense</span>
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Admin Portal
              </p>
            </div>
          </div>
        </div>
        
        <Card className="glass-card border-border">
          <CardHeader className="text-center">
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@crowdsense.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Demo credentials:
              </p>
              <p className="text-xs text-center font-mono mt-1">
                admin@crowdsense.io / admin123
              </p>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            ← Back to public dashboard
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
