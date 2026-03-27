// Your imports remain unchanged
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileCard } from "@/components/ProfileCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, X, Save, Globe, Lock } from "lucide-react";

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface Skill {
  name: string;
  level: SkillLevel;
}

const Profile = () => {
  const { user, updateUser, toggleProfileVisibility } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    bio: "",
    avatar: user?.profilePhoto || "",
    isPublic: user?.profileVisibility === 'public' || false,
    skillsOffered: user?.skillsOffered || [] as Skill[],
    skillsWanted: user?.skillsWanted || [] as Skill[],
    availability: user?.availability || [] as string[]
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        location: user.location || "",
        bio: "",
        avatar: user.profilePhoto || "",
        isPublic: user.profileVisibility === 'public',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || []
      });
    }
  }, [user]);
 

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Beginner" as SkillLevel,
    type: "offered" as "offered" | "wanted"
  });
  const [newAvailability, setNewAvailability]=useState("");

  const handleSave = async () => {
    if (profileData.skillsOffered.length === 0 || profileData.skillsWanted.length === 0) {
      toast({
        title: "Missing Skills",
        description: "Please add at least one skill you can offer and one skill you want to learn.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    const updateData = {
      name: profileData.name,
      location: profileData.location,
      profilePhoto: profileData.avatar,
      skillsOffered: profileData.skillsOffered,
      skillsWanted: profileData.skillsWanted,
      availability: profileData.availability,
      profileVisibility: (profileData.isPublic ? 'public' : 'private') as "public" | "private"
    };
    console.log("Update Data: ",profileData.availability);
    const result = await updateUser(updateData);

    if (result.success) {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive"
      });
    }

    setIsUpdating(false);
  };

  const handlePrivacyToggle = async (isPublic: boolean) => {
    const result = await toggleProfileVisibility(isPublic);
    if (result.success) {
      setProfileData(prev => ({ ...prev, isPublic }));
      toast({
        title: "Privacy Updated",
        description: `Your profile is now ${isPublic ? 'public' : 'private'}.`
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const addAvailability = () => {
    if (!newAvailability.trim()) return;
    const availability = newAvailability.trim();
    setProfileData(prev => ({
      ...prev,
      availability: [...prev.availability, availability]
    }));
    setNewAvailability(""); 
  };

  const removeAvailability = (availability: string) => {
    setProfileData(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a !== availability)
    }));
  }

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    const skill = { name: newSkill.name, level: newSkill.level };

    if (newSkill.type === "offered") {
      setProfileData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, skill]
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, skill]
      }));
    }

    setNewSkill({ name: "", level: "Beginner", type: "offered" });
  };

  const removeSkill = (skillName: string, type: "offered" | "wanted") => {
    if (type === "offered") {
      setProfileData(prev => ({
        ...prev,
        skillsOffered: prev.skillsOffered.filter(s => s.name !== skillName)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        skillsWanted: prev.skillsWanted.filter(s => s.name !== skillName)
      }));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  My <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Profile</span>
                </h1>
                <p className="text-muted-foreground mt-2">Manage your skills, availability, and profile settings</p>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" /> Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProfileCard
                  id={user?.id || "current-user"}
                  name={profileData.name}
                  location={profileData.location}
                  avatar={profileData.avatar}
                  rating={4.9}
                  skillsOffered={profileData.skillsOffered}
                  skillsWanted={profileData.skillsWanted}
                  availability={profileData.availability}
                  bio={profileData.bio}
                  completedSwaps={0}
                  isOwnProfile={true}
                />
              </div>

              <div className="space-y-6">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {profileData.isPublic ? <Globe className="h-5 w-5 mr-2 text-success" /> : <Lock className="h-5 w-5 mr-2 text-warning" />}
                      Profile Visibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{profileData.isPublic ? 'Public Profile' : 'Private Profile'}</p>
                        <p className="text-sm text-muted-foreground">
                          {profileData.isPublic ? 'Others can discover and contact you' : 'Your profile is hidden from search results'}
                        </p>
                      </div>
                      <Switch checked={profileData.isPublic} onCheckedChange={handlePrivacyToggle} />
                    </div>
                  </CardContent>
                </Card>

                {isEditing && (
                  <>
                    <Card className="shadow-soft">
                      <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <Input id="name" value={profileData.name} onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} />
                        <Input id="location" placeholder="City, State" value={profileData.location} onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))} />
                        <Textarea id="bio" placeholder="Tell others about yourself..." value={profileData.bio} onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))} rows={3} />
                      </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                      <CardHeader><CardTitle>Add New Skill</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <Input id="skill-name" placeholder="e.g., Guitar" value={newSkill.name} onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Type</Label>
                            <div className="flex space-x-2 mt-1">
                              <Button variant={newSkill.type === "offered" ? "default" : "outline"} size="sm" onClick={() => setNewSkill(prev => ({ ...prev, type: "offered" }))}>Offer</Button>
                              <Button variant={newSkill.type === "wanted" ? "default" : "outline"} size="sm" onClick={() => setNewSkill(prev => ({ ...prev, type: "wanted" }))}>Want</Button>
                            </div>
                          </div>
                          <div>
                            <Label>Level</Label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm" value={newSkill.level} onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as SkillLevel }))}>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        <Button onClick={addSkill} size="sm" className="w-full"><Plus className="h-4 w-4 mr-2" />Add Skill</Button>
                      </CardContent>
                      <CardHeader><CardTitle>Add New Availability</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                         <Input id="availability" placeholder="e.g., Weekdays, Weekends" value={newAvailability} onChange={(e) => setNewAvailability(( e.target.value ))} />
                        <Button onClick={addAvailability} size="sm" className="w-full"><Plus className="h-4 w-4 mr-2" />Add Availability</Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                      <CardHeader><CardTitle>Manage Skills & Availability</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <Label className="text-sm font-medium text-muted-foreground">Skills You Offer</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.skillsOffered.map(skill => (
                            <Badge key={skill.name} variant="secondary" className="cursor-pointer hover:bg-destructive/90" onClick={() => removeSkill(skill.name, "offered")}>
                              {skill.name}<X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>

                        <Label className="text-sm font-medium text-muted-foreground">Skills You Want</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.skillsWanted.map(skill => (
                            <Badge key={skill.name} variant="outline" className="cursor-pointer hover:bg-destructive/90 hover:text-destructive-foreground" onClick={() => removeSkill(skill.name, "wanted")}>
                              {skill.name}<X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardContent>
                        <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                         <div className="flex flex-wrap gap-2 mt-2">
                          {profileData.availability.map(avail => (
                            <Badge key={avail} variant="outline" className="cursor-pointer hover:bg-destructive/90" onClick={() => removeAvailability(avail)}>
                              {avail}<X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
