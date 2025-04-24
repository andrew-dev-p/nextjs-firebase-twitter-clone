import { useQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { PostEntity } from "../types/entities";
import { QueryKey } from "@/lib/constants";
import { APIRoute } from "@/lib/constants";

const fetchPosts = async (userId?: string): Promise<PostEntity[]> =>
  (await axiosClient.get<PostEntity[]>(APIRoute.POSTS, { params: { userId } }))
    .data;

export const useQueryPosts = (userId?: string) =>
  useQuery<PostEntity[]>({
    queryKey: [QueryKey.POSTS, userId],
    queryFn: () => fetchPosts(userId),
  });
