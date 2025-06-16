'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { getOwnedMferTokens } from '@/lib/utils/checkMferOwnership';
import { usePosts } from '@/hooks/usePosts';
import { useMferBalance } from '@/hooks/useMferBalance';
import { format } from 'date-fns';
import Image from 'next/image';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { balance, isLoading: isBalanceLoading } = useMferBalance();
  const [ownedTokens, setOwnedTokens] = useState<{title: string, image: string}[]>([]);
  const [selectedToken, setSelectedToken] = useState<{title: string, image: string} | null>(null);
  const [postContent, setPostContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { posts, fetchPosts, createPost, loading } = usePosts();

  // Fetch owned mfers
  useEffect(() => {
    setMounted(true);
    if (address) {
      setIsChecking(true);
      getOwnedMferTokens(address)
        .then((tokens) => setOwnedTokens(tokens as {title: string, image: string}[] ))
        .catch((e) => setError('Error fetching mfers'))
        .finally(() => setIsChecking(false));
    } else {
      setOwnedTokens([]);
    }
  }, [address]);

  // Fetch posts on mount and when address changes
  useEffect(() => {
    console.log('Fetching posts');
    fetchPosts();
  }, [fetchPosts]);

  // Get today's date string for filtering
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  // Find tokenIds that have already posted today
  const postedTitles = posts
    .filter(
      (post) =>
        post.author.address.toLowerCase() === address?.toLowerCase() &&
        format(new Date(post.createdAt), 'yyyy-MM-dd') === todayStr
    )
    .map((post) => String((post.author as any).title || (post.author as any).tokenId));

  const canPost =
    isConnected &&
    ownedTokens.length > 0 &&
    selectedToken &&
    !postedTitles.includes(selectedToken.title) &&
    postContent.trim().length > 0;

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPost) return;
    if (!selectedToken) return;
    await createPost(postContent, selectedToken.title, selectedToken.image, balance || '0');
    setPostContent('');
    fetchPosts();
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-24 md:pt-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="flex justify-end">
          <div className="flex items-center gap-2 border-2 border-gray-300 rounded-md p-2">
            {isConnected && !isBalanceLoading && (
              <p className="text-lg"> {balance || '0'} $mfer</p>
            )}
            <ConnectButton showBalance={false} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-center my-4 sm:my-8">Mfers Daily</h1>
        <p className="text-center text-lg sm:text-xl mb-4 sm:mb-8 px-4">One post a day per mfer. No grind. Just mfers.</p>

        {/* Posts Display Section */}
        <div className="mt-8 sm:mt-12 w-full max-w-2xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Recent Posts</h2>
          {loading && posts.length === 0 ? (
            <p className="text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full">
                      <Image
                        src={post.author.thumbnail || ''}
                        alt="Mfer"
                        fill
                        className="object-cover rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="font-bold text-base sm:text-lg">{post.author.title}</span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Balance: {post.author.balance} $mfer
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {isConnected && (
          <div className="text-center mt-4 px-4">
            {isChecking ? (
              <p>Checking mfer ownership...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : ownedTokens.length > 0 ? (
              <>
                <p className="text-green-600 mb-4">You are a mfer holder! 🎉</p>
                <form onSubmit={handlePost} className="flex flex-col items-center gap-3 sm:gap-4">
                  <select
                    className="border rounded px-2 py-1 w-full max-w-xs sm:max-w-sm"
                    value={selectedToken?.title || ''}
                    onChange={(e) => {
                      const selectedTokenTemp = ownedTokens.find(({title}) => title === e.target.value);
                      setSelectedToken(selectedTokenTemp|| null);
                    }}
                  >
                    <option value="">Select your mfer</option>
                    {ownedTokens.map(({title}, idx) => (
                        <option
                          key={idx}
                          value={title}
                          disabled={postedTitles.includes(title)}
                        >
                          {title}
                          {postedTitles.includes(title) ? ' (already posted today)' : ''}
                        </option>
                    ))}
                  </select>
                  {selectedToken?.title && (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full">
                      <Image
                        src={ownedTokens.find(({title}) => title === selectedToken.title)?.image || ''}
                        alt="Selected Mfer"
                        fill
                        className="object-cover rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <textarea
                    className="border rounded px-2 py-1 w-full max-w-xs sm:max-w-sm"
                    rows={3}
                    maxLength={500}
                    placeholder="What's your vibe today?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 w-full max-w-xs sm:max-w-sm"
                    disabled={!canPost || loading}
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </>
            ) : (
              <p className="text-red-600">You need to be a mfer holder to participate</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
