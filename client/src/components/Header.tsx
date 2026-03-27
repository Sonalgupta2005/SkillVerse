import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, User, MessageSquare, Settings, LogOut, Shield, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const { user, isAuthenticated, signout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-smooth">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <img className="w-8 h-8 rounded-full" src="/logo2.png" alt="Logo" />
                      SkillVerse
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link 
                      to="/browse" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${location.pathname === '/browse' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      Browse Skills
                    </Link>
                    {isAuthenticated && (
                      <Link 
                        to="/my-swaps" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors hover:text-primary ${location.pathname === '/my-swaps' ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        My Swaps
                      </Link>
                    )}
                    {user?.email === 'admin@skillverse.com' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center text-lg font-medium transition-colors hover:text-primary ${location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
                <img className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-soft" src="/logo2.png" alt="SkillVerse Logo" />
                <span className="text-xl font-bold text-foreground hidden sm:inline-block">SkillVerse</span>
              </Link>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/browse" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/browse' ? 'text-primary' : 'text-muted-foreground'}`}>
                Browse Skills
              </Link>
              {isAuthenticated && (
                <Link to="/my-swaps" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/my-swaps' ? 'text-primary' : 'text-muted-foreground'}`}>
                  My Swaps
                </Link>
              )}
              {user?.email === 'admin@skillverse.com' && (
                <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-primary flex items-center ${location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="transition-smooth hover:scale-110"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.profilePhoto} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setAuthMode('signin');
                      setShowAuthModal(true);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                  >
                    Join SkillVerse
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authMode}
      />
    </>
  );
};