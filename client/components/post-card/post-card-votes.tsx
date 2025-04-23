import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { PostEntity } from "@/types/entities";

export enum VoteDirection {
  Up = "up",
  Down = "down",
}

const PostCardVotes = ({ post }: { post: PostEntity }) => {
  const initialVotes = (post.likes?.length || 0) - (post.dislikes?.length || 0);
  const [votes, setVotes] = useState(initialVotes);
  const [voteStatus, setVoteStatus] = useState<VoteDirection | null>(null);

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

  return (
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
      <span className="w-6 text-center font-semibold mb-0.5">{votes}</span>
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
  );
};

export default PostCardVotes;
