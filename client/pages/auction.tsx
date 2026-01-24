import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader } from "../components/common";
import { getMarketContract, getNFTContract } from "../context";
import { DATA_URL, shortenAddress } from "../utils";
import { loadNFTMetadata } from "../utils/loadNFTMetadata";

interface AuctionItem {
  itemId: number;
  nftContract: string;
  tokenId: number;
  creator: string;
  startPrice: string;
  highestBid: string;
  highestBidder: string;
  startTime: number;
  endTime: number;
  active: boolean;
  claimed: boolean;
  image?: string;
  name?: string;
  description?: string;
}

const AuctionsPage: NextPage = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmounts, setBidAmounts] = useState<{ [key: number]: string }>({});
  const [signerAddress, setSignerAddress] = useState("");
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: number }>({});
   

  // Load auctions
  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSignerAddress(address);

      const market = await getMarketContract(provider);
      const nftContract = await getNFTContract(provider);

      const allAuctions = await market.getAllAuctions();

      const parsed: AuctionItem[] = await Promise.all(
        allAuctions.map(async (a: any) => {
          const meta = await loadNFTMetadata(a.tokenId.toString(), nftContract);

          return {
            itemId: a.itemId.toNumber(),
            tokenId: a.tokenId.toString(),
            nftContract: a.nftContract,
            creator: a.creator,
            startPrice: ethers.utils.formatEther(a.startPrice),
            highestBid: ethers.utils.formatEther(a.highestBid),
            highestBidder: a.highestBidder,
            startTime: a.startTime.toNumber(),
            endTime: a.endTime.toNumber(),
            active: a.active,
            claimed: a.claimed,
            name: meta?.name || "Unknown NFT",
            image: meta?.image || "/placeholder.png",
            description: meta?.description || "",
          };
        })
      );

      setAuctions(parsed);
    } catch (err) {
      console.error("Load auctions failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Place Bid
  const placeBid = async (auctionId: number) => {
    try {
      const amount = bidAmounts[auctionId];
      if (!amount) return alert("Enter bid amount");

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const market = await getMarketContract(provider, signer);

      const tx = await market.placeBid(auctionId, {
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();

      alert("Bid placed!");
      loadAuctions();
    } catch (err: any) {
      console.error(err);
      alert(err?.reason || "Bid failed");
    }
  };

  // Claim Auction
  const claimAuction = async (auctionId: number) => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const market = await getMarketContract(provider, signer);

      const tx = await market.claimAuction(auctionId);
      await tx.wait();

      alert("Auction claimed!");
      loadAuctions();
    } catch (err: any) {
      console.error(err);
      alert(err?.reason || "Claim failed");
    }
  };

  //  CANCEL AUCTION FUNCTION
  const cancelAuction = async (auctionId: number) => {
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const market = await getMarketContract(provider, signer);

      const tx = await market.cancelAuction(auctionId);
      await tx.wait();

      alert("Auction cancelled!");
      loadAuctions();
    } catch (err: any) {
      console.error("Cancel failed:", err);
      alert(err?.reason || err?.message || "Cancel failed");
    }
  };

  // Countdown formatter
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const updated: { [key: number]: number } = {};
        auctions.forEach(a => {
          const remaining = Math.max(0, Math.floor(a.endTime - Date.now() / 1000));
          updated[a.itemId] = remaining;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  const activeAuctions = auctions.filter(a => a.active && !a.claimed);

  return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>Active Auctions</title>
      </Head>

      {loading ? (
        <Loader className="w-[400px] h-[400px] mx-auto" size={400} />
      ) : (
        <div className="relative w-[75%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_100px_rgba(0,255,255,0.15)]">
          <h1 className="text-center text-6xl font-black mb-8 
                   text-blue-400 drop-shadow-[0_0_20px_cyan]">
            Active Auctions
          </h1>
          {activeAuctions.length === 0 && (
            <p className="text-center text-gray-400 col-span-full">
              No active auctions right now.
            </p>
          )}

          {activeAuctions.map(a => {
            const ended = Date.now() / 1000 > a.endTime;
            const isCreator:boolean = a.creator.toLowerCase() === signerAddress.toLowerCase();
            const hasBid = Number(a.highestBid) > 0;

            // OpenSea cancel rule
            const canCancel =
              isCreator &&
              a.active &&
              !a.claimed &&
              !ended &&
              !hasBid;

            return (
              <div key={a.itemId} className="relative w-[250px] rounded-3xl overflow-hidden cursor-pointer
                  bg-gray-100/30 backdrop-blur-md border border-gray-300
                  shadow-xl hover:shadow-[0_0_60px_rgba(255,0,255,0.6)]
                  transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-3xl blur-xl pointer-events-none rainbow-gradient"></div>
                  {/* Image */}
                  <div className="w-full max-w-[500px] overflow-hidden">
                    <Image
                      unoptimized
                      src={a.image || ""}
                      alt={a.name || ""}
                      width={250}
                      height={250}
                      className="rounded-xl"
                      blurDataURL={DATA_URL}
                      placeholder="blur"
                    />
                  </div>
                  <div className="p-4 space-y-3 bg-gray-100/30 backdrop-blur-md rounded-3xl">
                    <h2 className="text-xl font-bold mt-0">{a.name}</h2>

                    <div className="flex flex-col w-full mb-4">
                      <div className="flex justify-between">
                        <span>Seller:</span>
                        <span>{shortenAddress(a.creator)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Start Price:</span>
                        <span>{a.startPrice} ETH</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Highest Bid:</span>
                        <span>{a.highestBid} ETH</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Highest Bidder:</span>
                        <span>{shortenAddress(a.highestBidder)}</span>
                      </div>

                      <div className="flex justify-between text-gray-400 text-sm">
                        <span>Ends in:</span>
                        <span>{formatTime(timeLeft[a.itemId] || 0)}</span>
                      </div>
                    </div>
              </div>
              {/* Custom rainbow animation */}
              <style jsx>{`
                .rainbow-gradient {
                  background: linear-gradient(270deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #9900ff);
                  background-size: 1400% 1400%;
                  animation: rainbowMove 12s ease infinite;
                }

                @keyframes rainbowMove {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
                {/* Bid Section */}
                {a.active && !ended && ! isCreator &&(
                  <div className="mt-1 flex flex-col gap-2">
                    <div className="flex  w-full">
                      <button
                      onClick={() => placeBid(a.itemId)}
                      className="bg-green-500 p-2 rounded-bl-3xl rounded-tr-none rounded-tl-none rounded-br-none w-full font-bold z-10"
                      >
                        Place Bid
                      </button>
                      <input
                        type="number"
                        placeholder="ETH"
                        className="p-2 text-black w-full rounded-br-3xl rounded-tr-none rounded-tl-none rounded-bl-none focus:outline-none z-10"
                        onChange={(e) =>
                        setBidAmounts({ ...bidAmounts, [a.itemId]: e.target.value })
                      }
                      />
                    </div>
                  </div>
                )}
                    {/* Cancel Auction Button */}
                    {a.active && !ended && isCreator && canCancel && (
                      <button
                        onClick={() => cancelAuction(a.itemId)}
                        className="bg-red-600  p-2 rounded-md w-full mt-1 font-bold relative z-40"
                      >
                        Cancel
                      </button>
                    )}                 
                {/* Claim Section */}
                {ended && !a.claimed && (
                  <button
                    onClick={() => claimAuction(a.itemId)}
                    className="bg-yellow-600 p-2 rounded-3xl w-full mt-1 font-bold relative z-40"
                  >
                    Claim Auction
                  </button>
                )}

                {/* Cancel Disabled Info */}
                {isCreator && hasBid && a.active && !ended && (
                  <p className="text-white-600 text-center text-sm mt-1 h-[30px] relative z-40">
                     Can not cancel after bid
                  </p>
                )}

                {/* Claimed Status */}
                {a.claimed && (
                  <p className="text-green-600 mt-1 font-bold relative z-40">✔ Claimed</p>
                )}
              </div>
            );
          })}
        </div>
        
      )}
    </div>
  );
};

export default AuctionsPage;
