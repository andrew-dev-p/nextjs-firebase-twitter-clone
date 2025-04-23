import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axios-client";
import { PostEntity } from "../types/entities";
import { APIRoute, QueryKey } from "@/lib/constants";
import { toast } from "react-toastify";

const createPost = async (
  post: Omit<
    PostEntity,
    | "id"
    | "likesCount"
    | "dislikesCount"
    | "commentsCount"
    | "likes"
    | "dislikes"
    | "createdAt"
    | "comments"
  >
) => {
  const res = await axiosClient.post<PostEntity>(APIRoute.POSTS, post);
  return res.data;
};

const updatePost = async ({
  id,
  update,
}: {
  id: string;
  update: Partial<PostEntity>;
}) => {
  const res = await axiosClient.patch<PostEntity>(
    APIRoute.POST.replace(":id", id),
    update
  );
  return res.data;
};

const deletePost = async (id: string) => {
  const res = await axiosClient.delete(APIRoute.POST.replace(":id", id));
  return res.data;
};

export const useMutatePosts = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  const { mutateAsync: update } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: [QueryKey.POSTS] });
    },
  });

  return { create, update, remove };
};
