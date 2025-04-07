/**
 * Template for extending other query hooks with options
 *
 * For query hooks:
 *
 * const useMyQuery = <TData = ReturnType>(
 *   param: ParamType | undefined,
 *   options?: Omit<UseQueryOptions<ReturnType | null, Error, TData>, 'queryKey' | 'queryFn' | 'enabled'>
 * ) => {
 *   return useQuery<ReturnType | null, Error, TData>({
 *     queryKey: ['key', param],
 *     queryFn: () => param ? service.method(supabase, param) : null,
 *     enabled: !!param,
 *     ...options,
 *   });
 * };
 *
 * For mutation hooks:
 *
 * const useMyMutation = (
 *   options?: Omit<UseMutationOptions<ReturnType, Error, ParamType>, 'mutationFn'>
 * ) => {
 *   return useMutation<ReturnType, Error, ParamType>({
 *     mutationFn: (param: ParamType) => service.method(supabase, param),
 *     onSuccess: (data, variables, context) => {
 *       queryClient.invalidateQueries({ queryKey: ['key'] });
 *       options?.onSuccess?.(data, variables, context);
 *     },
 *     ...options,
 *   });
 * };
 */

