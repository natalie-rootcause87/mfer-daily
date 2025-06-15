import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  content: string;
  author: {
    address: string;
    title: string;
    thumbnail: string;
  };
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { address } = useAccount();

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data: PostsResponse = await response.json();

      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (content: string, title: string, thumbnail: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, title, address, thumbnail }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create post');
        }

        const newPost = await response.json();
        setPosts((prev) => [newPost, ...prev]);
        toast.success('Post created successfully!');
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to create post');
      } finally {
        setLoading(false);
      }
    },
    [address]
  );

  return {
    posts,
    loading,
    hasMore,
    page,
    fetchPosts,
    createPost,
  };
} 