import { useBalance } from 'wagmi';
import { useAccount } from 'wagmi';

function formatBalance(balance: string | undefined): string {
  if (!balance) return '0.00';
  
  const num = parseFloat(balance);
  if (isNaN(num)) return '0.00';

  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'MM';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
}

export function useMferBalance() {
  const { address } = useAccount();
  
  const { data: balance, isLoading, error } = useBalance({
    address,
    token: '0xE3086852A4B125803C815a158249ae468A3254Ca', // mfercoin contract address
  });

  return {
    balance: formatBalance(balance?.formatted),
    isLoading,
    error,
  };
} 