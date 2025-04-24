import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { APIRoute, QueryKey } from "@/lib/constants";
import { toast } from "react-toastify";

const createComment = async (comment: { postId: string; content: string }) => {
  const res = await axiosClient.post(APIRoute.COMMENTS, comment);
  return res.data;
};

export const useMutateComments = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comment added");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { create };
};
