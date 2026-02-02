import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { AnimatedHeadline } from '@/components/AnimatedHeadline';
import { IndiaMapAnimation } from '@/components/IndiaMapAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Map, BarChart3, Radio, Signal, Activity, MapPin, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HowItWorks} from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
 
const HomePage = () => {
  const navigate = useNavigate();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [signalCount, setSignalCount] = useState(0);

  // Simulate live signal detection
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background - Theme aware */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark mode: neon glow effects */}
          <div className="dark:block hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          {/* Light mode: soft teal gradient */}
          <div className="dark:hidden block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          </div>
        </div>

        {/* Grid pattern overlay - Dark mode only */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.02] hidden dark:block"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="container relative z-10 px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Live indicator */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-low" />
                </span>
                <span className="text-sm font-medium text-primary">
                  LIVE • {signalCount.toLocaleString()} signals detected
                </span>
              </motion.div>

              {/* Animated headline */}
              <AnimatedHeadline className="py-2" />

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
              >
                Real-time crowd intelligence across India — turning live data into timely decisions.
                {hoveredCity && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="block mt-2 text-primary font-medium"
                  >
                    Monitoring: {hoveredCity}
                  </motion.span>
                )}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg dark:shadow-primary/20"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Signal className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Start Sensing Live Data</span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/heatmap')}
                  className="group border-primary/30 hover:border-primary/50 hover:bg-primary/5 dark:bg-transparent bg-white/50"
                >
                  <Map className="w-5 h-5 mr-2" />
                  View India Heatmap
                </Button>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-3 gap-4 pt-8"
              >
                {[
                  { label: 'Active Locations', value: '26+', icon: MapPin, color: 'text-primary' },
                  { label: 'Live Updates', value: '5s', icon: Zap, color: 'text-status-low' },
                  { label: 'Cities Covered', value: '12', icon: Activity, color: 'text-status-medium' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <Card className="glass-card dark:bg-card/50 bg-white/80">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Animated India Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-[550px] mx-auto">
                {/* Outer glow ring - Dark mode only */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/20 dark:block hidden"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Light mode card container */}
                <div className="dark:hidden absolute inset-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/50 shadow-lg" />
                
                {/* Map container */}
                <div className="absolute inset-8">
                  <IndiaMapAnimation 
                    className="w-full h-full"
                    onCityHover={setHoveredCity}
                  />
                </div>

                {/* Corner decorations - Dark mode */}
                <div className="dark:block hidden">
                  {[0, 90, 180, 270].map((rotation) => (
                    <motion.div
                      key={rotation}
                      className="absolute w-8 h-8 border-l-2 border-t-2 border-primary/30"
                      style={{
                        top: rotation < 180 ? 0 : 'auto',
                        bottom: rotation >= 180 ? 0 : 'auto',
                        left: rotation === 0 || rotation === 270 ? 0 : 'auto',
                        right: rotation === 90 || rotation === 180 ? 0 : 'auto',
                        transform: `rotate(${rotation}deg)`,
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        delay: rotation / 360,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center text-xs text-muted-foreground mt-4"
              >
                Animated visualization represents simulated real-time signals
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-border/50 dark:bg-card/30 bg-muted/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Enterprise-Grade <span className="text-gradient-primary">Crowd Intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor, analyze, and predict crowd patterns across your locations with real-time precision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Map,
                title: 'Live Heatmap',
                description: 'Interactive India-wide visualization with real-time density indicators and movement tracking.',
              },
              {
                icon: BarChart3,
                title: 'Predictive Analytics',
                description: 'AI-powered insights for peak hour predictions and crowd behavior patterns.',
              },
              {
                icon: Radio,
                title: 'Instant Alerts',
                description: 'Automated notifications when locations approach or exceed capacity thresholds.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card h-full hover:shadow-lg transition-shadow dark:hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <FAQ />
      <Footer />
    </PageLayout>
  );
};

export default HomePage;
