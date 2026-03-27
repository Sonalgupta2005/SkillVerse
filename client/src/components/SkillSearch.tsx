import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

const popularSkills = [
  "Web Development", "Guitar", "Photography", "Spanish", "Excel", "Cooking",
  "Yoga", "Piano", "Graphic Design", "Writing", "Marketing", "Dancing"
];

const categories = [
  "Technology", "Music", "Languages", "Arts & Crafts", "Sports & Fitness",
  "Business", "Cooking", "Photography", "Writing", "Health & Wellness"
];

interface SkillSearchProps {
  onSkillSelect: (skill: string) => void;
  selectedSkills: string[];
  onCategorySelect?: (category: string) => void;
  selectedCategories?: string[];
  onClearSkills?: () => void;
}

export const SkillSearch = ({ 
  onSkillSelect, 
  selectedSkills,
  onCategorySelect,
  selectedCategories: externalCategories = [],
  onClearSkills
}: SkillSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategories = externalCategories.length > 0 ? externalCategories : localCategories;

  const handleSkillClick = (skill: string) => {
    onSkillSelect(skill);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      onSkillSelect(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleCategorySelect = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      setLocalCategories(prev => 
        prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
      );
    }
  };

  const clearFilters = () => {
    if (!onCategorySelect) setLocalCategories([]);
    
    setSearchQuery("");
    
    if (onClearSkills) {
      onClearSkills();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-primary" />
            Search Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search for a skill and press Enter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                className="pl-11 h-12 rounded-xl border-border/50 bg-muted/10 focus-visible:ring-primary/30 focus-visible:bg-background transition-all shadow-inner"
              />
            </div>
            
            <div className="flex gap-2 h-12">
              <Button
                onClick={handleSearchSubmit}
                className="h-12 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm font-semibold"
              >
                <Search className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-6 rounded-xl shrink-0 relative shadow-sm hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Filter className="h-4 w-4 sm:mr-2 transition-transform group-hover:scale-105" />
                <span className={`hidden sm:inline font-medium ${showFilters ? 'font-semibold' : ''}`}>Filters</span>
                
                {/* Active Indicator */}
                {selectedCategories.length > 0 && !showFilters && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm" />
                )}
              </Button>
            </div>
          </div>

          {/* Filters Area */}
          {showFilters && (
            <div className="border border-primary/20 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-muted/30 to-background shadow-lg space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center text-primary/80 text-sm uppercase tracking-wide">
                  <Filter className="w-4 h-4 mr-2" /> 
                  Skill Categories
                </h4>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 px-3 text-xs font-medium w-full sm:w-auto justify-center">
                  <X className="h-3 w-3 mr-1" />
                  Clear Selection
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "secondary"}
                    className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${selectedCategories.includes(category) ? 'shadow-md scale-105 bg-primary hover:bg-primary/90' : 'hover:bg-primary/15 hover:scale-105 bg-muted/40 border border-border/40 text-foreground/80'}`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Selected Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="cursor-pointer hover:bg-destructive/90 transition-smooth"
                    onClick={() => onSkillSelect(skill)}
                  >
                    {skill}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Skills */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Popular Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};