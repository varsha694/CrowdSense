import { motion } from "framer-motion";
import { MapPin, Radio, Eye, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MapPin,
    title: "Add Location & Capacity",
    description: "Set up your venue by defining zones, areas, and maximum capacity thresholds for each space.",
  },
  {
    number: "02",
    icon: Radio,
    title: "Stream Crowd Data",
    description: "Connect your data sources—sensors, cameras, or manual updates—to feed real-time information.",
  },
  {
    number: "03",
    icon: Eye,
    title: "Monitor Live Status",
    description: "Watch crowd levels update in real-time on your dashboard with zone-by-zone visibility.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Analyze & Optimize",
    description: "Use historical trends and insights to improve flow, reduce wait times, and enhance experiences.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30" />
      
      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Simple Setup
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="hero-gradient-text">CrowdSense</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our intuitive platform. No complex hardware required.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="card-glass rounded-2xl p-6 h-full hover:scale-[1.02] transition-transform duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">{step.number}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
