import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promocodesApi } from "@/lib/api";
import type { Promocode } from "@shared/schema";

export function usePromocodes() {
  return useQuery({
    queryKey: ["promocodes"],
    queryFn: promocodesApi.getAll,
  });
}

export function useValidatePromocode() {
  return useMutation({
    mutationFn: ({ code, orderAmount }: { code: string; orderAmount: number }) =>
      promocodesApi.validate(code, orderAmount),
  });
}

export function useCreatePromocode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      code: string;
      discountPercentage: string;
      minOrderAmount?: string;
      maxOrderAmount?: string;
      type: "single_use" | "temporary";
      expiresAt?: Date;
      isActive?: boolean;
    }) => promocodesApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
  });
}

export function useUpdatePromocode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        code?: string;
        discountPercentage?: string;
        minOrderAmount?: string;
        maxOrderAmount?: string;
        type?: "single_use" | "temporary";
        expiresAt?: Date;
        isActive?: boolean;
      };
    }) => promocodesApi.update(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
  });
}

export function useDeletePromocode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promocodesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
  });
}
