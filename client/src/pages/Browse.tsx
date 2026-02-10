import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkillSearch } from "@/components/SkillSearch";
import { ProfileCard } from "@/components/ProfileCard";
import { useAuth } from "@/contexts/AuthContext";
import { useMySwaps } from "@/hooks/useMySwaps";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

const Browse = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { user, isLoading } = useAuth();

  /* =======================
     FETCH PROFILES (QUERY)
     ======================= */
  const {
    data: profilesData,
    isFetching: profilesLoading
  } = useQuery({
    queryKey: ["public-profiles", selectedSkills, page],
    queryFn: () =>
      apiService.getPublicProfiles({
        skills: selectedSkills,
        page
      }),
    enabled: !isLoading,
    placeholderData: keepPreviousData
  });

  const profiles = profilesData?.users || [];
  const totalPages = profilesData?.pages || 1;

  /* =======================
     FETCH SWAPS (QUERY)
     ======================= */
  const { data: swaps = [] } = useMySwaps();

  /* =======================
     HELPERS
     ======================= */
  const handleSkillSelect = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setPage(1);
  };

  const getSwapForProfile = (profileId: string) => {
    return swaps.find(swap => {
      const otherUserId =
        swap.fromUser._id === user?._id
          ? swap.toUser._id
          : swap.fromUser._id;

      return otherUserId === profileId;
    });
  };

  const visibleProfiles = user
    ? profiles.filter(p => p._id !== user._id)
    : profiles;

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Skills & People
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect match for your skill swap.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-4xl mx-auto">
            <SkillSearch
              onSkillSelect={handleSkillSelect}
              selectedSkills={selectedSkills}
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {selectedSkills.length > 0
                  ? `Results for: ${selectedSkills.join(", ")}`
                  : "Featured Members"}
              </h2>
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            </div>

            {/* Grid */}
            {profilesLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading profiles...
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleProfiles.map(profile => {
                  const swap = user
                    ? getSwapForProfile(profile._id)
                    : null;

                  return (
                    <ProfileCard
                      key={profile._id}
                      id={profile._id}
                      name={profile.name}
                      location={profile.location}
                      avatar={profile.avatar}
                      rating={profile.rating}
                      skillsOffered={profile.skillsOffered}
                      skillsWanted={profile.skillsWanted}
                      availability={profile.availability}
                      bio={profile.bio}
                      completedSwaps={profile.completedSwaps}
                      swapId={swap?._id}
                      swapStatus={swap?.status}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
