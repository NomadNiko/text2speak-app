import { useGetUsersService } from "@/services/api/services/users";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserFilterType, UserSortType } from "../user-filter-types";

export const usersQueryKeys = createQueryKeys(["users"], {
  list: () => ({
    key: [],
    sub: {
      by: ({ filter }: { filter: UserFilterType | undefined }) => ({
        key: [filter],
      }),
    },
  }),
});

export const useGetUsersQuery = ({
  filter,
}: {
  filter?: UserFilterType | undefined;
  sort?: UserSortType | undefined;
} = {}) => {
  const getUsersService = useGetUsersService();

  const query = useInfiniteQuery({
    // Remove sort from query key to avoid refetching when only sort changes
    queryKey: usersQueryKeys.list().sub.by({ filter }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await getUsersService(
        undefined,
        {
          page: pageParam,
          limit: 10,
          filters: filter,
          // Don't use sort on server since we'll sort client-side
          sort: undefined,
        },
        {
          signal,
        }
      );
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
      // Return empty data if not OK
      return {
        data: [],
        nextPage: undefined,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  return query;
};
