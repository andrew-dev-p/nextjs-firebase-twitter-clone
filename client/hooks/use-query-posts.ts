import { useQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { PostEntity } from "../types/entities";
import { QueryKey } from "@/lib/constants";
import { APIRoute } from "@/lib/constants";
import { SortOption } from "@/app/(app)/feed/page";

const fetchPosts = async (
  userId?: string,
  sortOption?: SortOption
): Promise<PostEntity[]> =>
  (
    await axiosClient.get<PostEntity[]>(APIRoute.POSTS, {
      params: { userId, sortOption },
    })
  ).data;

export const useQueryPosts = (userId?: string, sortOption?: SortOption) =>
  useQuery<PostEntity[]>({
    queryKey: [QueryKey.POSTS, { userId, sortOption }],
    queryFn: () => fetchPosts(userId, sortOption),
  });
