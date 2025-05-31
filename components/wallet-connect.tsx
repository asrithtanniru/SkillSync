import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";

export default function WalletConnect() {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="wallet-section p-4 border-2 border-gray-200 rounded-lg my-4 text-center">
      {!address ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet to Earn SST Tokens</h3>
          <ConnectWallet
            theme="dark"
            btnTitle="Connect Wallet"
          />
        </div>
      ) : (
        <div>
          <p className="text-green-600 font-medium">
            ✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <button
            onClick={disconnect}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
} 
