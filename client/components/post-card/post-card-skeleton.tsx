import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton = () => {
  return (
    <Card className="overflow-hidden max-w-2xl w-full py-3 gap-2 animate-pulse">
      <div className="w-full h-64 overflow-hidden p-2 rounded-lg">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      <CardContent className="space-y-2 px-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-0 w-full">
        <div className="flex justify-around items-center gap-4 w-full">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
        <div className="w-full mt-2">
          <Skeleton className="h-6 w-1/2" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCardSkeleton;
