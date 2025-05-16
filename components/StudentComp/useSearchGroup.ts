import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/request/mutation/useDebounce";
import { request } from "@/request";

export const useSearchGroups = (name: string) => {
  const debouncedName = useDebounce({ value: name });

  return useQuery({
    queryKey: ["search-groups", debouncedName],
    queryFn: async () => {
      const res = await request.get(
        `/api/student/search-group?name=${debouncedName}`
      );
      return res.data.data;
    },
    enabled: !!debouncedName,
  });
};
