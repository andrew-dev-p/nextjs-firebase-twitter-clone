import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { APIRoute, QueryKey } from "@/lib/constants";
import { toast } from "react-toastify";

const createComment = async (comment: { postId: string; content: string }) => {
  const res = await axiosClient.post(APIRoute.COMMENTS, comment);
  return res.data;
};

const updateComment = async (update: {
  postId: string;
  commentId: string;
  content: string;
}) => {
  const res = await axiosClient.patch(APIRoute.COMMENTS, update);
  return res.data;
};

const deleteComment = async (del: { postId: string; commentId: string }) => {
  const res = await axiosClient.delete(APIRoute.COMMENTS, { data: del });
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

  const { mutateAsync: update } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      toast.success("Comment updated");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { create, update, remove };
};
