import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Star, MessageSquare, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { RequestSwapForm } from "@/components/RequestSwapForm";
// import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ProfileCardProps {
  id: string; // Added user ID for API calls
  name: string;
  location?: string;
  avatar?: string;
  rating: number;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  bio?: string;
  completedSwaps: number;
  isOwnProfile?: boolean;
  swapId?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled';

}

export const ProfileCard = ({ 
  id,
  name, 
  location, 
  avatar, 
  rating, 
  skillsOffered, 
  skillsWanted, 
  availability, 
  bio,
  completedSwaps,
  isOwnProfile = false ,
  swapId,
  status
}: ProfileCardProps) => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSwapForm, setShowSwapForm] = useState(false);
  const { openChat } = useChat();
  console.log('Rendering ProfileCard for:', name,swapId,status);
  const handleRequestSwap = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowSwapForm(true);
    }
  };

  

  return (
    <>
    <Card className="shadow-medium hover:shadow-large transition-smooth">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-xl">{name}</CardTitle>
              {location && (
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location}
                </div>
              )}
              <div className="flex items-center space-x-4">
                {rating > 0 && <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-warning mr-1 fill-current" />
                  <span className="font-medium">{rating}</span>
                </div>}
                
                <div className="text-sm text-muted-foreground">
                  {completedSwaps > 0 ? `(${completedSwaps})` : ''}
                </div>
              </div>
            </div>
          </div>
          {!isOwnProfile && (
            <div className="flex space-x-2 items-center">

  {/* PENDING */}
  {status === 'pending' && (
    <Badge variant="secondary">Pending</Badge>
  )}

  {/* ACCEPTED → CHAT ENABLED */}
  {status === 'accepted' && swapId && (
    <Button
      variant="outline"
      size="sm"
      onClick={() => openChat(id)}
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  )}

  {/* REJECTED / CANCELLED */}
  {(status === 'rejected' || status === 'cancelled') && (
    <Badge variant="destructive">
      {status.toUpperCase()}
    </Badge>
  )}

  {/* NO SWAP → REQUEST */}
  {!status && (
    <Button size="sm" onClick={handleRequestSwap}>
      <Calendar className="h-4 w-4" />
      Request Swap
    </Button>
  )}

</div>

          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {bio && (
          <div>
            <CardDescription className="text-base leading-relaxed">
              {bio}
            </CardDescription>
          </div>
        )}

        {/* Skills Offered */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Skills Offered
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsOffered.map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="skill-tag skill-tag-offered px-3 py-1.5"
              >
                {skill.name}
                <span className="ml-2 text-xs opacity-70">({skill.level})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Looking to Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsWanted.map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="skill-tag skill-tag-wanted px-3 py-1.5"
              >
                {skill.name}
                <span className="ml-2 text-xs opacity-70">({skill.level})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Availability
          </h4>
          <div className="flex flex-wrap gap-2">
            {availability.map((time, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    <AuthModal 
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultTab="signin"
    />
    
    <RequestSwapForm
      isOpen={showSwapForm}
      onClose={() => setShowSwapForm(false)}
      toUserId={id}
      toUserName={name}
      toUserSkillsWanted={skillsWanted}
      toUserSkillsOffered={skillsOffered}
    />
    </>
  );
};