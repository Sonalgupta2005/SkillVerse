import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCreateProfile = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="py-24 relative">
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            className="relative overflow-hidden rounded-[2rem] shadow-large"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Animated Background */}
            <motion.div 
              className="absolute inset-0 gradient-secondary"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            ></motion.div>
            
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
            
            {/* Content */}
            <div className="relative px-8 py-20 text-center z-10">
              <div className="max-w-3xl mx-auto space-y-8">
                <motion.div 
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                  }}
                >
                  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex justify-center">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2">
                      <Sparkles className="h-4 w-4 text-white" />
                      <span className="text-white font-semibold tracking-wide text-sm">Join the Community</span>
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
                    className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                  >
                    Ready to Start Your Skill Journey?
                  </motion.h2>
                  
                  <motion.p 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
                    className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
                  >
                    Join thousands of learners and teachers making meaningful connections 
                    through skill sharing. Your next learning adventure is just one click away.
                  </motion.p>

                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2 } } }} 
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                  >
                    <Button 
                      variant="secondary" 
                      size="xl" 
                      onClick={handleCreateProfile}
                      className="bg-white text-secondary hover:bg-white/90 group shadow-medium border-0 font-bold"
                    >
                      {isAuthenticated ? "Go to My Profile" : "Create Your Profile"}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="xl" 
                      onClick={() => navigate("/browse")}
                      className="bg-transparent border-white text-white hover:bg-white/10 font-bold"
                    >
                      Browse Skills
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </>
  );
};