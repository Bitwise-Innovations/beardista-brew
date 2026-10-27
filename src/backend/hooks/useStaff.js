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
  return useQuery({ queryKey: STAFF_KEY, queryFn: listStaff });
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