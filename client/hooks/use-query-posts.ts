import { useQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { PostEntity } from "../types/entities";
import { QueryKey } from "@/lib/constants";
import { APIRoute } from "@/lib/constants";

const fetchPosts = async (): Promise<PostEntity[]> =>
  (await axiosClient.get<PostEntity[]>(APIRoute.POSTS)).data;

export const useQueryPosts = () =>
  useQuery<PostEntity[]>({
    queryKey: [QueryKey.POSTS],
    queryFn: fetchPosts,
  });
