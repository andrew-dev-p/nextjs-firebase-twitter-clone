"use client";

import { useState } from "react";
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
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { PostEntity, CommentEntity } from "@/types/entities";

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

  const handleVote = (direction: VoteDirection) => {
    if (voteStatus === direction) {
      setVoteStatus(null);
      setVotes(initialVotes);
    } else {
      const previousVote =
        voteStatus === null ? 0 : voteStatus === VoteDirection.Up ? 1 : -1;
      const newVote = direction === VoteDirection.Up ? 1 : -1;
      const newTotalVote = initialVotes + newVote - previousVote;
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

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden">
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
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={"/placeholder.svg"} alt={"Anonymous"} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Anonymous • {formattedDate}
              </span>
            </div>
          </div>
        </div>
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
              <span className="w-6 text-center font-medium">{votes}</span>
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
          {isViewingComments && (
            <>
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
                          <AvatarImage
                            src={"/placeholder.svg"}
                            alt={"Anonymous"}
                          />
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
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
