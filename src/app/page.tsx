'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { checkMferOwnership, getOwnedMferTokens } from '@/lib/utils/checkMferOwnership';
import { usePosts } from '@/hooks/usePosts';
import { format } from 'date-fns';
import Image from 'next/image';

export default function Home() {
  const { address, isConnected } = useAccount();
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
    if (address) {
      console.log('Fetching posts for address:', address);
      fetchPosts();
    }
  }, [address, fetchPosts]);

  // Log posts updates
  useEffect(() => {
    if (posts && posts.length > 0) {
      console.log("First post author thumbnail:", posts[0].author.thumbnail);
    }
  }, [posts]);

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
    await createPost(postContent, selectedToken.title, selectedToken.image);
    setPostContent('');
    fetchPosts();
  };
console.log("posts", posts) 
  if (!mounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-end">
          <ConnectButton />
        </div>
        <h1 className="text-4xl font-bold text-center my-8">Mfer Daily</h1>
        <p className="text-center text-xl mb-8">One post a day per mfer. No grind. Just mfers.</p>
        {/* Posts Display Section */}
        <div className="mt-12 w-full max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          {loading && posts.length === 0 ? (
            <p className="text-center">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-10 h-10 bg-gray-200 rounded-full">
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
                    <span className="font-bold text-lg">{post.author.title}</span>
                    <span className="text-gray-500 text-sm">
                      {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {isConnected && (
          <div className="text-center mt-4">
            {isChecking ? (
              <p>Checking mfer ownership...</p>
            ) : error ? (
              <p className="text-red-600">Error: {error}</p>
            ) : ownedTokens.length > 0 ? (
              <>
                <p className="text-green-600 mb-4">You are a mfer holder! 🎉</p>
                <form onSubmit={handlePost} className="flex flex-col items-center gap-4">
                  <select
                    className="border rounded px-2 py-1"
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
                    <div className="relative w-20 h-20 bg-gray-200 rounded-full">
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
                    className="border rounded px-2 py-1 w-80"
                    rows={3}
                    maxLength={500}
                    placeholder="What's your vibe today?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
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
