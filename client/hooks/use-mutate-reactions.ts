import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { APIRoute, QueryKey } from "@/lib/constants";
import { toast } from "react-toastify";

const toggleLike = async (postId: string) => {
  const res = await axiosClient.post(APIRoute.REACTIONS_LIKE, { postId });
  return res.data;
};

const toggleDislike = async (postId: string) => {
  const res = await axiosClient.post(APIRoute.REACTIONS_DISLIKE, { postId });
  return res.data;
};

export const useMutateReactions = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: like } = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      toast.success("Reaction updated");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  const { mutateAsync: dislike } = useMutation({
    mutationFn: toggleDislike,
    onSuccess: () => {
      toast.success("Reaction updated");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { like, dislike };
};
