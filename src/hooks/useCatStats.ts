import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';

interface CatStats {
  totalPosts: number;
  daysActive: number;
  catInteractions: number;
  lastInteraction: Date | null;
  firstPostDate: Date | null;
  consecutiveDays: number;
  lastPostDate: Date | null;
}

interface Post {
  _id: string;
  author: {
    address: string;
    title?: string;
    tokenId?: string;
    thumbnail?: string;
    balance?: string;
  };
  content: string;
  createdAt: string;
}

export function useCatStats(address: string | undefined, posts: Post[]) {
  const [stats, setStats] = useState<CatStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`catStats_${address}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastInteraction: parsed.lastInteraction ? new Date(parsed.lastInteraction) : null,
          firstPostDate: parsed.firstPostDate ? new Date(parsed.firstPostDate) : null,
          lastPostDate: parsed.lastPostDate ? new Date(parsed.lastPostDate) : null
        };
      }
    }
    return {
      totalPosts: 0,
      daysActive: 0,
      catInteractions: 0,
      lastInteraction: null,
      firstPostDate: null,
      consecutiveDays: 0,
      lastPostDate: null
    };
  });

  // Calculate stats from posts
  useEffect(() => {
    if (!address || !posts.length) return;

    const userPosts = posts.filter((post: Post) => 
      post.author.address.toLowerCase() === address.toLowerCase()
    );

    if (userPosts.length === 0) return;

    const sortedPosts = userPosts.sort((a: Post, b: Post) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const firstPost = sortedPosts[0];
    const lastPost = sortedPosts[sortedPosts.length - 1];
    const firstPostDate = new Date(firstPost.createdAt);
    const lastPostDate = new Date(lastPost.createdAt);

    // Calculate consecutive days
    let consecutiveDays = 0;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Check if user posted today
    const postedToday = userPosts.some((post: Post) => 
      format(new Date(post.createdAt), 'yyyy-MM-dd') === todayStr
    );

    if (postedToday) {
      // Count consecutive days backwards from today
      const currentDate = new Date(today);
      let daysCounted = 0;
      
      while (daysCounted < 365) { // Limit to prevent infinite loop
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const hasPostOnDate = userPosts.some((post: Post) => 
          format(new Date(post.createdAt), 'yyyy-MM-dd') === dateStr
        );
        
        if (hasPostOnDate) {
          consecutiveDays++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
        daysCounted++;
      }
    }

    const daysActive = differenceInDays(lastPostDate, firstPostDate) + 1;

    setStats(prev => ({
      ...prev,
      totalPosts: userPosts.length,
      daysActive,
      firstPostDate,
      lastPostDate,
      consecutiveDays
    }));
  }, [address, posts]);

  // Save stats to localStorage
  useEffect(() => {
    if (address) {
      localStorage.setItem(`catStats_${address}`, JSON.stringify(stats));
    }
  }, [stats, address]);

  const incrementCatInteractions = (): void => {
    setStats(prev => ({
      ...prev,
      catInteractions: prev.catInteractions + 1,
      lastInteraction: new Date()
    }));
  };

  const resetStats = (): void => {
    const newStats: CatStats = {
      totalPosts: 0,
      daysActive: 0,
      catInteractions: 0,
      lastInteraction: null,
      firstPostDate: null,
      consecutiveDays: 0,
      lastPostDate: null
    };
    setStats(newStats);
    if (address) {
      localStorage.setItem(`catStats_${address}`, JSON.stringify(newStats));
    }
  };

  return {
    stats,
    incrementCatInteractions,
    resetStats
  };
} 