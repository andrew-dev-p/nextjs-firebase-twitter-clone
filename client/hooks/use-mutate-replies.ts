import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { APIRoute, QueryKey } from "@/lib/constants";
import { toast } from "react-toastify";

const createReply = async (reply: {
  postId: string;
  commentId: string;
  content: string;
}) => {
  const res = await axiosClient.post(APIRoute.COMMENTS_REPLY, reply);
  return res.data;
};

export const useMutateReplies = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create } = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      toast.success("Reply added");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { create };
};
