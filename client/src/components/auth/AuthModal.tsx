import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const { signin, signup, isLoading } = useAuth();
  const { toast } = useToast();

  const [signinForm, setSigninForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    offeredSkillName: '',
    offeredSkillLevel: 'Beginner',
    wantedSkillName: '',
    wantedSkillLevel: 'Beginner'
  });

  const resetForms = () => {
    setSigninForm({ email: '', password: '' });
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '', location: '', offeredSkillName: '', offeredSkillLevel: 'Beginner', wantedSkillName: '', wantedSkillLevel: 'Beginner' });
    setShowPassword(false);
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signinForm.email || !signinForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await signin(signinForm.email, signinForm.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to SkillVerse"
      });
      resetForms();
      onClose();
    } else {
      toast({
        title: "Sign In Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.offeredSkillName || !signupForm.wantedSkillName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including your skills",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    const result = await signup({
      name: signupForm.name,
      email: signupForm.email,
      password: signupForm.password,
      location: signupForm.location || undefined,
      skillsOffered: [{ name: signupForm.offeredSkillName, level: signupForm.offeredSkillLevel }],
      skillsWanted: [{ name: signupForm.wantedSkillName, level: signupForm.wantedSkillLevel }]
    });
    
    if (result.success) {
      toast({
        title: "Welcome to SkillVerse!",
        description: "Your account has been created successfully"
      });
      resetForms();
      onClose();
    } else {
      toast({
        title: "Sign Up Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillVerse
            </span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Join our community of skill sharers and learners
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card className="border-0 shadow-none">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center text-lg">
                  <LogIn className="h-5 w-5 mr-2 text-primary" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signinForm.email}
                      onChange={(e) => setSigninForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signinForm.password}
                        onChange={(e) => setSigninForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card className="border-0 shadow-none">
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center text-lg">
                  <UserPlus className="h-5 w-5 mr-2 text-primary" />
                  Create Account
                </CardTitle>
                <CardDescription>
                  Join SkillVerse and start sharing skills today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-location">Location (Optional)</Label>
                    <Input
                      id="signup-location"
                      type="text"
                      placeholder="City, State"
                      value={signupForm.location}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-offered-skill">Skill to Offer *</Label>
                        <Input
                          id="signup-offered-skill"
                          placeholder="e.g. Graphic Design"
                          value={signupForm.offeredSkillName}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, offeredSkillName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <select 
                          className="w-full h-10 px-3 py-2 border rounded-md text-sm bg-background border-input" 
                          value={signupForm.offeredSkillLevel} 
                          onChange={(e) => setSignupForm(prev => ({ ...prev, offeredSkillLevel: e.target.value }))}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-wanted-skill">Skill to Learn *</Label>
                        <Input
                          id="signup-wanted-skill"
                          placeholder="e.g. Python"
                          value={signupForm.wantedSkillName}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, wantedSkillName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Level</Label>
                        <select 
                          className="w-full h-10 px-3 py-2 border rounded-md text-sm bg-background border-input" 
                          value={signupForm.wantedSkillLevel} 
                          onChange={(e) => setSignupForm(prev => ({ ...prev, wantedSkillLevel: e.target.value }))}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Choose a strong password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password *</Label>
                    <Input
                      id="signup-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};