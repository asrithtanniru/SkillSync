import { useAddress, useContract, useTokenBalance } from "@thirdweb-dev/react";

export default function TokenBalance() {
  const address = useAddress();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: balance, isLoading } = useTokenBalance(contract, address);

  if (!address) return null;

  return (
    <div className="token-balance bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-xl my-4 text-center">
      <h3 className="text-lg font-semibold mb-2">Your SST Balance</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p className="balance text-3xl font-bold my-2">
          🪙 {balance?.displayValue || "0"} SST
        </p>
      )}
    </div>
  );
} 
