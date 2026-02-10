import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export const useMySwaps = () => {
  return useQuery({
    queryKey: ["my-swaps"],
    queryFn: async () => {
      const data = await apiService.getMySwaps();
      return [
        ...(data.sentSwaps || []),
        ...(data.receivedSwaps || [])
      ];
    },
    staleTime: 1000 * 30 // 30s
  });
};
