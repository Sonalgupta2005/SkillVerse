import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Star, Code, Palette, Music, Globe, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const floatingIcons = [
    { Icon: Code, color: "text-primary", bg: "bg-primary/20", delay: 0, x: -90, y: -60 },
    { Icon: Palette, color: "text-secondary", bg: "bg-secondary/20", delay: 1, x: 100, y: 30 },
    { Icon: Music, color: "text-accent", bg: "bg-accent/20", delay: 2, x: -60, y: 100 },
    { Icon: Globe, color: "text-success", bg: "bg-success/20", delay: 1.5, x: 80, y: -100 },
    { Icon: Briefcase, color: "text-warning", bg: "bg-warning/20", delay: 0.5, x: 0, y: 140 },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-70 dark:opacity-40"></div>
      
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse pointer-events-none delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Share Skills,{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Build Community
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connect with others to teach what you know and learn what you need. 
                SkillVerse makes skill-sharing simple, fun, and rewarding.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div className="flex flex-wrap gap-6" variants={itemVariants}>
              <div className="flex items-center space-x-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">10,000+ Members</span>
              </div>
              <div className="flex items-center space-x-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
                <BookOpen className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold">500+ Skills</span>
              </div>
              <div className="flex items-center space-x-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border/50 shadow-sm">
                <Star className="h-5 w-5 text-warning" />
                <span className="text-sm font-semibold">4.9 Rating</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
              <Button onClick={() => navigate("/browse")} variant="hero" size="xl" className="group w-full sm:w-auto">
                Start Sharing Skills
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => navigate("/browse")} variant="outline" size="xl" className="w-full sm:w-auto bg-background/50 backdrop-blur-md border-border/50">
                Browse Skills
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Animated Floating Skills Layout */}
          <motion.div 
            className="relative hidden lg:flex items-center justify-center min-h-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central glowing hub */}
              <div className="w-32 h-32 rounded-full gradient-primary shadow-large flex items-center justify-center z-10 animate-pulse border border-white/20">
                <Users className="w-16 h-16 text-white" />
              </div>

              {/* Orbital floating icons */}
              {floatingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  className={`absolute w-16 h-16 rounded-2xl ${item.bg} backdrop-blur-xl border border-white/10 shadow-medium flex items-center justify-center z-20`}
                  animate={{
                    y: [item.y, item.y - 20, item.y],
                    x: [item.x, item.x + 10, item.x],
                  }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: item.delay,
                  }}
                >
                  <item.Icon className={`w-8 h-8 ${item.color}`} />
                </motion.div>
              ))}

              {/* Floating cards */}
              <motion.div 
                className="absolute top-10 left-10 bg-card/80 backdrop-blur-xl p-4 rounded-xl shadow-large border border-border z-30 flex items-center space-x-3"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Web Dev</div>
                  <div className="text-xs text-muted-foreground">Expert</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 right-10 bg-card/80 backdrop-blur-xl p-4 rounded-xl shadow-large border border-border z-30 flex items-center space-x-3"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              >
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Design</div>
                  <div className="text-xs text-muted-foreground">Beginner</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};