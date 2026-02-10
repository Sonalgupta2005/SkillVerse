import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export const usePublicProfiles = (
  skills: string[],
  page: number,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["public-profiles", skills, page],
    queryFn: () => apiService.getPublicProfiles({ skills, page }),
    enabled, // 🔥 THIS replaces your isLoading logic
    placeholderData: keepPreviousData
  });
};
