"use client";

import { useState } from "react";
import { getUserFromDb } from "@/firebase/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigDown, ArrowBigUp, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { PostEntity, CommentEntity } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";

export enum VoteDirection {
  Up = "up",
  Down = "down",
}

interface PostCardProps {
  post: PostEntity;
  isPreview?: boolean;
}

export function PostCard({ post, isPreview = false }: PostCardProps) {
  const initialVotes = (post.likes?.length || 0) - (post.dislikes?.length || 0);
  const [voteStatus, setVoteStatus] = useState<VoteDirection | null>(null);
  const [votes, setVotes] = useState(initialVotes);
  const [isViewingComments, setIsViewingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentEntity[]>(
    post.comments || []
  );

  const currentUser = useAuthStore((state) => state.user);

  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<UserEntity | null>({
    queryKey: [QueryKey.USER, post.userId],
    queryFn: () => getUserFromDb(post.userId),
    enabled: !!post.userId && !isPreview,
    staleTime: 60 * 1000,
  });

  const handleVote = (direction: VoteDirection) => {
    if (voteStatus === direction) {
      setVoteStatus(null);
      setVotes(initialVotes);
    } else {
      const previousVote =
        voteStatus === null ? 0 : voteStatus === VoteDirection.Up ? 1 : -1;
      const newVote = direction === VoteDirection.Up ? 1 : -1;
      const newTotalVote = votes + newVote - previousVote;
      setVoteStatus(direction);
      setVotes(newTotalVote);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: CommentEntity = {
      id: Date.now().toString(),
      userId: "anonymous",
      content: commentText,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setCommentText("");
    setIsViewingComments(false);
  };

  return (
    <Card className="overflow-hidden max-w-2xl">
      {post.photoUrl && (
        <div className="w-full h-64 overflow-hidden p-2 rounded-lg">
          <Image
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
            width={480}
            height={270}
            priority
          />
        </div>
      )}
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <div className="flex flex-row items-center gap-4">
          <Avatar>
            {authorLoading ? (
              <AvatarFallback>...</AvatarFallback>
            ) : author && author.profilePhotoUrl ? (
              <AvatarImage src={author.profilePhotoUrl} />
            ) : (
              <AvatarFallback>
                {author ? author.username[0]?.toUpperCase() : "A"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-semibold text-base">
              {isPreview
                ? "You"
                : authorLoading
                ? "Loading..."
                : author
                ? author.username
                : authorError
                ? "Error"
                : "Anonymous"}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
        {author === currentUser && <div>123</div>}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.description}</p>
      </CardContent>
      {!isPreview && (
        <CardFooter className="flex flex-col items-start pt-0">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    voteStatus === VoteDirection.Up
                      ? "scale-105 text-green-500 hover:text-green-500 hover:-translate-y-1 hover:pb-1"
                      : ""
                  }`}
                  onClick={() => handleVote(VoteDirection.Up)}
                >
                  <ArrowBigUp className="h-5 w-5" />
                </Button>
              </motion.div>
              <span className="w-6 text-center font-semibold mb-0.5">
                {votes}
              </span>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    voteStatus === VoteDirection.Down
                      ? "scale-105 text-red-500 hover:text-red-500 hover:translate-y-1 hover:pt-1"
                      : ""
                  }`}
                  onClick={() => handleVote(VoteDirection.Down)}
                >
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsViewingComments(!isViewingComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length} Comments</span>
            </Button>
          </div>
          <AnimatePresence>
            {isViewingComments && (
              <motion.div
                key="comments-section"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              >
                <div className="mt-4 w-full">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      size="icon"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {comments.length > 0 && (
                  <div className="mt-4 w-full space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Anonymous</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm pl-8">{comment.content}</p>
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-10 mt-2 space-y-2 border-l border-muted-foreground/20 pl-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2"
                              >
                                <Avatar className="h-5 w-5 mt-1">
                                  <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div>
                                  <span className="font-medium text-xs">
                                    Anonymous
                                  </span>
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                      new Date(reply.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                  <div className="text-xs pl-7">
                                    {reply.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      )}
    </Card>
  );
}
