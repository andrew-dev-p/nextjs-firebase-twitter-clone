"use client";

import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { CreatePostModal } from "./create-post-modal";
import { useQueryPosts } from "@/hooks/use-query-posts";
import { GlowingButton } from "./glowing-button";
import { Posts } from "./posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SortOption, sortOptionsToLabelMap } from "@/lib/constants";

export default function FeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Recent);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 5;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQueryPosts(undefined, sortOption, limit, searchQuery);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const loadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    await fetchNextPage();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pt-20">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed Your Curiosity!</h1>
          <GlowingButton onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Create Post
          </GlowingButton>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sortOptionsToLabelMap).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="space-y-6 flex flex-col items-center">
        <Posts
          isLoading={isLoading}
          posts={posts}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      <div className="flex justify-center my-4">
        {hasNextPage && (
          <Button onClick={loadMore} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
}
