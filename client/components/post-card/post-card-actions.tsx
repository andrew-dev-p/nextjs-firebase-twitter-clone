import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import type { FC } from "react";

interface PostCardActionsProps {
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostCardActions: FC<PostCardActionsProps> = ({
  isOwner,
  onEdit,
  onDelete,
}) => {
  if (!isOwner) return null;
  return (
    <div className="flex justify-center gap-2">
      <Button size="sm" variant="outline" onClick={onEdit}>
        <PencilIcon />
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>
        <TrashIcon />
      </Button>
    </div>
  );
};
