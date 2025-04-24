import { useInfiniteQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { PostEntity } from "../types/entities";
import { QueryKey, APIRoute } from "@/lib/constants";
import { SortOption } from "@/app/(app)/feed/page";

const fetchPosts = async (
  userId?: string,
  sortOption?: SortOption,
  cursor?: string,
  limit?: number
) => {
  const { data } = await axiosClient.get(APIRoute.POSTS, {
    params: { userId, sortOption, cursor, limit },
  });
  return data as { posts: PostEntity[]; nextCursor?: string };
};

export const useQueryPosts = (
  userId?: string,
  sortOption: SortOption = SortOption.Recent,
  limit = 5
) =>
  useInfiniteQuery<{ posts: PostEntity[]; nextCursor?: string }, Error>({
    queryKey: [QueryKey.POSTS, userId, sortOption, limit],
    queryFn: async ({ pageParam }) =>
      fetchPosts(userId, sortOption, pageParam as string | undefined, limit),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
