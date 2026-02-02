import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Activity, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center relative"
      >
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight">
              Crowd<span className="text-primary">Sense</span>
            </h1>
          </div>
        </div>
        
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="bg-gradient-primary hover:opacity-90 gap-2">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
