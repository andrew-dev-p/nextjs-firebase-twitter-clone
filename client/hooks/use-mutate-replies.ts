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

const updateReply = async (update: {
  postId: string;
  commentId: string;
  replyId: string;
  content: string;
}) => {
  const res = await axiosClient.patch(APIRoute.COMMENTS_REPLY, update);
  return res.data;
};

const deleteReply = async (del: {
  postId: string;
  commentId: string;
  replyId: string;
}) => {
  const res = await axiosClient.delete(APIRoute.COMMENTS_REPLY, { data: del });
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

  const { mutateAsync: update } = useMutation({
    mutationFn: updateReply,
    onSuccess: () => {
      toast.success("Reply updated");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      toast.success("Reply deleted");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { create, update, remove };
};
