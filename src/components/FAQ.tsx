import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is CrowdSense truly real-time?",
    answer: "Yes! CrowdSense updates crowd density and wait time data in real-time with sub-second latency. You'll see changes the moment they happen, enabling immediate response to crowd dynamics.",
  },
  {
    question: "Does it require specialized hardware or IoT devices?",
    answer: "No specialized hardware is required. CrowdSense can integrate with existing camera systems, WiFi analytics, or accept manual updates. We also offer optional sensor integrations for enhanced accuracy.",
  },
  {
    question: "Who can use CrowdSense?",
    answer: "CrowdSense is designed for any organization managing crowds—event venues, hospitals, universities, corporate offices, government services, shopping centers, and more. Our flexible platform adapts to diverse use cases.",
  },
  {
    question: "Is CrowdSense scalable?",
    answer: "Absolutely. Our cloud-native architecture scales from a single location to thousands of venues worldwide. Whether you're managing one office or a global network of facilities, CrowdSense grows with you.",
  },
  {
    question: "How is my data secured?",
    answer: "Security is our priority. CrowdSense employs enterprise-grade encryption, SOC 2 compliance, and GDPR-compliant data handling. Your crowd data is encrypted at rest and in transit, with role-based access controls.",
  },
  {
    question: "Can I integrate CrowdSense with existing systems?",
    answer: "Yes. CrowdSense offers robust APIs and pre-built integrations with popular platforms including digital signage systems, building management systems, and business intelligence tools.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="hero-gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about CrowdSense. Can't find what you're looking for? Contact our team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="card-glass rounded-2xl px-6 border-0 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
