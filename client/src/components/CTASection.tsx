import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 gradient-secondary"></div>
          
          {/* Content */}
          <div className="relative px-8 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-white font-medium">Join the Community</span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Start Your Skill Journey?
                </h2>
                
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Join thousands of learners and teachers making meaningful connections 
                  through skill sharing. Your next learning adventure is just one click away.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="bg-white text-secondary hover:bg-white/90 group"
                >
                  Create Your Profile
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="bg-white text-secondary hover:bg-white/90 group"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};