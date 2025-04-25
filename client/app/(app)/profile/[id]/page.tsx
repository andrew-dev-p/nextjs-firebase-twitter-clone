"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { Posts } from "../../feed/posts";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/lib/constants";
import { getUserFromDb } from "@/firebase/db";
import { useQueryPosts } from "@/hooks/use-query-posts";
import { SortOption } from "../../feed/page";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  const { id }: { id: string } = useParams();

  const { data: user } = useQuery({
    queryKey: [QueryKey.USER, id],
    queryFn: () => getUserFromDb(id),
  });

  const limit = 5;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryPosts(id, SortOption.Recent, limit);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const loadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pt-20">
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profilePhotoUrl || "/placeholder.svg"}
                alt={user?.username}
              />
              <AvatarFallback className="text-3xl">
                {user?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user?.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="mb-1">{user?.email}</span>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Posts isLoading={isLoading} posts={posts} isViewOnly />
          </TabsContent>

          <TabsContent value="about">
            <Card className="p-6 gap-3">
              <h2 className="text-xl font-semibold">About {user?.username}</h2>
              <p className="text-muted-foreground">
                This is {user?.username}&apos;s profile page. They joined
                recently and are sharing their thoughts and experiences.
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center my-4">
          {hasNextPage && (
            <Button onClick={loadMore} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
