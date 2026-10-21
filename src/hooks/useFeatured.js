import { useQuery } from "@tanstack/react-query";
import { getFeatured } from "@/services/itemsService";
import { mapItem } from "@/mappers/itemMapper";
import { customerFavoritesData } from "@/data/menu.jsx";

export function useFeatured() {
  const query = useQuery({
    queryKey: ["items", "featured"],
    queryFn: async () => (await getFeatured()).map(mapItem),
  });
  return {
    items: query.data?.length ? query.data : customerFavoritesData,
    loading: query.isLoading,
  };
}