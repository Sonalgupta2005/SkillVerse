import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, MessageSquare, Star, Shield, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Create Your Profile",
    description: "Showcase your skills and what you'd like to learn. Control your privacy settings and availability.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Search,
    title: "Discover Skills",
    description: "Browse and search for specific skills. Find the perfect match for your learning goals.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: MessageSquare,
    title: "Request Swaps",
    description: "Send skill swap requests and manage your exchanges. Track pending and active swaps.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Give feedback after each swap. Build your reputation and help others make informed decisions.",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    icon: Calendar,
    title: "Schedule Flexibility",
    description: "Set your availability and find others who match your schedule. Learn at your own pace.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Shield,
    title: "Safe Community",
    description: "Verified profiles, secure messaging, and community guidelines keep everyone safe.",
    color: "text-success",
    bgColor: "bg-success/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          className="text-center space-y-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            How SkillVerse Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, safe, and effective skill sharing in just a few steps
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group h-full bg-card/40 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:shadow-medium hover:-translate-y-1 transition-smooth shadow-soft">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce shadow-sm`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};