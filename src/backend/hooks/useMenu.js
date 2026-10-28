import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  addMenuItem,
  deleteCategory,
  deleteMenuItem,
  editCategory,
  editMenuItem,
  fetchCategories,
  fetchMenuItems,
  incrementItemViewCount,
  recordMenuItemView,
  reorderCategories,
  uploadMenuItemImage,
} from "../services/menuService";

export const menuQueryKeys = {
  all: ["menu"],
  categories: () => [...menuQueryKeys.all, "categories"],
  categoryList: (options) => [...menuQueryKeys.categories(), options],
  items: () => [...menuQueryKeys.all, "items"],
  itemList: (options) => [...menuQueryKeys.items(), options],
};

export function useCategories(options = {}) {
  return useQuery({
    queryKey: menuQueryKeys.categoryList(options),
    queryFn: () => fetchCategories(options),
  });
}

export function useMenuItems(options = {}) {
  return useQuery({
    queryKey: menuQueryKeys.itemList(options),
    queryFn: () => fetchMenuItems(options),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategory,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.categories() }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => editCategory(id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.categories() }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: menuQueryKeys.categories(),
        }),
        queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() }),
      ]);
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderCategories,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.categories() }),
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMenuItem,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() }),
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => editMenuItem(id, updates),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() }),
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() }),
  });
}

export function useIncrementItemViewCount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: incrementItemViewCount,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() }),
  });
}
export function useUploadMenuImage() {
  return useMutation({ mutationFn: (file) => uploadMenuItemImage(file) });
}

export function useRecordMenuView() {
  return useMutation({ mutationFn: recordMenuItemView });
}