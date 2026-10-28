import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaff,
  listStaff,
  removeStaff,
  resetStaffPassword,
  updateStaff,
} from "../services/staffService";

const STAFF_KEY = ["staff", "list"];

export function useStaffList() {
  return useQuery({
    queryKey: STAFF_KEY,
    queryFn: listStaff,
    // Don't retry "log in again" or "owner only" errors; they won't fix themselves.
    retry: (failureCount, error) =>
      !/log in again|only the owner/i.test(error?.message ?? "") && failureCount < 2,
  });
}
function useStaffMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export const useCreateStaff = () => useStaffMutation(createStaff);
export const useUpdateStaff = () => useStaffMutation(updateStaff);
export const useResetStaffPassword = () => useStaffMutation(resetStaffPassword);
export const useRemoveStaff = () => useStaffMutation(removeStaff);