import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { formProgramsService } from "@/utils/supabase/services/form-programs";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type FormProgramRow = Tables<"form_program">;
type FormProgramInsert = TablesInsert<"form_program">;
type FormProgramUpdate = TablesUpdate<"form_program">;

export const useFormPrograms = <TData = FormProgramRow[]>(
  options?: Omit<
    UseQueryOptions<FormProgramRow[], Error, TData>,
    "queryKey" | "queryFn"
  >
) => {
  const supabase = createClient();
  return useQuery<FormProgramRow[], Error, TData>({
    queryKey: ["form-programs"],
    queryFn: () => formProgramsService.getAll(supabase),
    ...options,
  });
};

export const useFormProgram = <TData = FormProgramRow>(
  programId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormProgramRow | null, Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormProgramRow | null, Error, TData>({
    queryKey: ["form-programs", programId],
    queryFn: () =>
      programId ? formProgramsService.getById(supabase, programId) : null,
    enabled: !!programId,
    ...options,
  });
};

export const useFormProgramsByCategory = <TData = FormProgramRow[]>(
  categoryId: string | undefined,
  options?: Omit<
    UseQueryOptions<FormProgramRow[], Error, TData>,
    "queryKey" | "queryFn" | "enabled"
  >
) => {
  const supabase = createClient();
  return useQuery<FormProgramRow[], Error, TData>({
    queryKey: ["form-programs", "category", categoryId],
    queryFn: () =>
      categoryId ? formProgramsService.getByCategory(supabase, categoryId) : [],
    enabled: !!categoryId,
    ...options,
  });
};

export const useCreateFormProgram = (
  options?: Omit<
    UseMutationOptions<FormProgramRow, Error, FormProgramInsert>,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<FormProgramRow, Error, FormProgramInsert>({
    mutationFn: (program) => formProgramsService.create(supabase, program),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form-programs"] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateFormProgram = (
  options?: Omit<
    UseMutationOptions<
      FormProgramRow,
      Error,
      { programId: string; updates: FormProgramUpdate }
    >,
    "mutationFn"
  >
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<
    FormProgramRow,
    Error,
    { programId: string; updates: FormProgramUpdate }
  >({
    mutationFn: ({ programId, updates }) =>
      formProgramsService.update(supabase, programId, updates),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["form-programs"] });
      queryClient.invalidateQueries({
        queryKey: ["form-programs", variables.programId],
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteFormProgram = (
  options?: Omit<UseMutationOptions<boolean, Error, string>, "mutationFn">
) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (programId) => formProgramsService.delete(supabase, programId),
    onSuccess: (data, programId, context) => {
      queryClient.invalidateQueries({ queryKey: ["form-programs"] });
      options?.onSuccess?.(data, programId, context);
    },
    ...options,
  });
};
