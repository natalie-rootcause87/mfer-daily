import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Mfer contract address
const MFER_CONTRACT = '0x79fcdef22feed20eddacbb2587640e45491b757f';

// ERC721 ABI for balanceOf function
const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function getOwnedMferTokens(address: string): Promise<{title: string, image: string}[]> {
  try {
    if (!process.env.NEXT_PUBLIC_ALCHEMY_ID) {
      throw new Error('Alchemy API key not configured');
    }

    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}/getNFTs?owner=${address}&contractAddresses[]=${MFER_CONTRACT}`
    );

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }

    const data = await response.json();
    const ownedNfts = data.ownedNfts || [];
    console.log("ownedNfts", ownedNfts[0])
    // Extract token IDs as strings
    return ownedNfts.map((nft: any) => ({
      title: nft.title,
      image: nft.media && nft.media[0] ? nft.media[0].thumbnail || nft.media[0].gateway : '',
    })); // "mfer #1234"
  } catch (error) {
    console.error('Error fetching owned mfers:', error);
    return [];
  }
}

// For backward compatibility, you can keep the old function:
export async function checkMferOwnership(address: string): Promise<boolean> {
  const tokenIds = await getOwnedMferTokens(address);
  return tokenIds.length > 0;
} 