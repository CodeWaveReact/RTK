import { useMutation, useQueryClient } from "@tanstack/react-query";

// Generic interface for items with an ID
export interface WithId {
  id?: string | number;
  [key: string]: any;
}

interface OptimisticMutationOptions<TData, TVariables> {
  queryKey: string[];
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables, queryClient: any) => void;
  onError?: (error: Error, variables: TVariables, context: any) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
}

// Generic optimistic update functions that work with any type that has an ID
export const optimisticUpdates = {
  create: <T extends WithId>(old: T[] | undefined, newItem: T) => {
    return old ? [...old, newItem] : [newItem];
  },
  update: <T extends WithId>(old: T[] | undefined, updatedItem: T) => {
    return old ? old.map(item => item.id === updatedItem.id ? updatedItem : item) : [];
  },
  delete: <T extends WithId>(old: T[] | undefined, id: string | number | undefined) => {
    if (!id) return old || [];
    return old ? old.filter(item => item.id !== id) : [];
  },
};

export function useOptimisticMutation<TData, TVariables>({
  queryKey,
  mutationFn,
  onMutate,
  onError,
  onSuccess,
}: OptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Call custom onMutate if provided
      if (onMutate) {
        onMutate(variables, queryClient);
      }

      // Return context with the snapshotted value
      return { previousData };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      // Call custom onError if provided
      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: (data, variables) => {
      // Call custom onSuccess if provided
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
  });
}