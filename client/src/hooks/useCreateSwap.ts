import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";

interface CreateSwapPayload {
  toUser: string;
  offeredSkill: string;
  wantedSkill: string;
  message: string;
}

export const useCreateSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSwapPayload) =>
      apiService.requestSwap(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-swaps"] });
      queryClient.invalidateQueries({ queryKey: ["public-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    }
  });
};
