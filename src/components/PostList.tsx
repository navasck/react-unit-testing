import { useState, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const PAGE_SIZE = 20;
const TOTAL_POSTS = 100;

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

type Props = {
  fetchFn?: typeof fetch;
};

function PostCard({ post }: { post: Post }) {
  return (
    <div
      data-testid={`post-${post.id}`}
      className="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
    >
      <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1">
        #{post.id} · User {post.userId}
      </p>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white capitalize mb-1 line-clamp-1">
        {post.title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {post.body}
      </p>
    </div>
  );
}

function PostList({ fetchFn = fetch }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs so loadMore guards are always current, even if called outside the observer
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMoreRef.current) return; // guard: no-op when all pages loaded
    setIsLoading(true);
    setError(null);
    try {
      const start = pageRef.current * PAGE_SIZE;
      const res = await fetchFn(
        `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to load posts");

      const data: Post[] = await res.json();
      pageRef.current += 1;

      setPosts((prev) => [...prev, ...data]);

      if (start + data.length >= TOTAL_POSTS || data.length < PAGE_SIZE) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading,fetchFn]);

  // Sentinel at bottom of list — triggers loadMore when scrolled into view
  const sentinelRef = useIntersectionObserver<HTMLDivElement>(
    loadMore,
    hasMore && !isLoading,
    { threshold: 0.1 },
  );

  // Scroll container for the virtualizer
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer — only renders items currently visible in the scroll window
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 88,
    overscan: 5,
  });

  return (
    <section
      aria-label="post list"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Posts
        </h2>
        {posts.length > 0 && (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {posts.length} / {TOTAL_POSTS}
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      {/* Virtualized scroll container */}
      <div
        ref={parentRef}
        className="overflow-auto rounded-lg border border-gray-100 dark:border-gray-700"
        style={{ height: 480 }}
        aria-label="posts container"
      >
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualizer.getVirtualItems().map((vItem) => (
            <div
              key={vItem.key}
              data-index={vItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                transform: `translateY(${vItem.start}px)`,
              }}
            >
              <PostCard post={posts[vItem.index]} />
            </div>
          ))}
        </div>

        {/* Sentinel — intersection observer target */}
        <div
          ref={sentinelRef}
          data-testid="sentinel"
          aria-hidden="true"
          style={{ height: 1 }}
        />
      </div>

      {/* Status bar */}
      <div className="mt-3 text-center text-sm">
        {isLoading && (
          <p
            aria-label="loading posts"
            className="text-indigo-500 animate-pulse"
          >
            Loading posts…
          </p>
        )}
        {!hasMore && posts.length > 0 && (
          <p
            aria-label="all posts loaded"
            className="text-gray-400 dark:text-gray-500"
          >
            All {posts.length} posts loaded ✓
          </p>
        )}
      </div>
    </section>
  );
}

export default PostList;




// This component combines infinite scrolling and virtualization. Infinite scrolling uses an IntersectionObserver to detect when a sentinel element reaches the viewport and then fetches the next page of data. Virtualization, implemented with @tanstack/react-virtual, ensures that only the visible rows and a small overscan buffer are rendered. This keeps the DOM size small and scrolling smooth even when hundreds or thousands of records are loaded. The combination provides both efficient network loading and efficient rendering performance.



// Infinite scrolling only optimizes data fetching by loading records incrementally. However, all previously loaded items remain mounted in the DOM, causing memory usage and rendering costs to grow over time. Virtualization solves this by rendering only the visible items and a small buffer, keeping the DOM size constant regardless of how much data has been loaded. For large datasets, infinite scrolling and virtualization are commonly used together.
