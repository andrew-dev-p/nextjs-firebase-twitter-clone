import { CommentEntity } from "@/types/entities";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import CommentCard from "./comment-card";
import { useMutateComments } from "@/hooks/use-mutate-comments";

const CommentSection = ({
  isViewingComments,
  postId,
  comments,
}: {
  isViewingComments: boolean;
  postId: string;
  comments: CommentEntity[];
}) => {
  const [commentText, setCommentText] = useState("");

  const { create } = useMutateComments();

  const handleAddComment = () => {
    create({
      postId,
      content: commentText,
    });
    setCommentText("");
  };

  return (
    <AnimatePresence>
      {isViewingComments && (
        <motion.div
          className="w-full"
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
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentSection;
