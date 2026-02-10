import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export type SwapStatus = "pending" | "accepted" | "rejected" | "cancelled";


export const useUpdateSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SwapStatus }) =>
      apiService.updateSwapStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-swaps"] });
    }
  });
};
