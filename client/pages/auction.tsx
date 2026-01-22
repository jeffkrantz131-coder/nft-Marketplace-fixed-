// import { useContext, useEffect, useState } from "react";
// import { MarketContext } from "../context/marketContext";
// import { NFTCard } from "../components/collections/NFTCard";
// import { ethers } from "ethers";

// interface IAuctionItem {
//   itemId: string;
//   auctionId: string;
//   image: string;
//   name: string;
//   creator: string;
//   price: string; // current highest bid or start price
//   endTime: number;
// }

// const AuctionPage = () => {
//   const { marketContract, nftContract, web3Provider } = useContext(MarketContext);
//   const [auctions, setAuctions] = useState<IAuctionItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!marketContract || !nftContract) return;

//     const fetchAuctions = async () => {
//       try {
//         setLoading(true);

//         // 👇 Replace this with your contract function that returns auctions
//         const allAuctions = await marketContract.getAllAuctions();

//         const activeAuctions = allAuctions.filter((a: any) => a.active);

//         const items = await Promise.all(
//           activeAuctions.map(async (auction: any) => {
//             const tokenUri: string = await nftContract.tokenURI(auction.tokenId);
//             const ipfsUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
//             const metadata = await fetch(ipfsUri).then((res) => res.json());

//             return {
//               itemId: auction.tokenId.toString(),
//               auctionId: auction.itemId.toString(),
//               image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
//               name: metadata.name,
//               creator: auction.creator,
//               price: ethers.utils.formatEther(
//                 auction.highestBid.gt(0) ? auction.highestBid : auction.startPrice
//               ),
//               endTime: Number(auction.endTime),
//             };
//           })
//         );

//         setAuctions(items);
//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to fetch auctions:", err);
//         setLoading(false);
//       }
//     };

//     fetchAuctions();
//   }, [marketContract, nftContract]);

//   return (
//     <div className="bg-gradient text-white py-5">
//       <h1 className="text-4xl text-center font-bold text-blue-600 mb-8">
//         Active Auctions
//       </h1>

//       {loading ? (
//         <p className="text-center text-xl">Loading auctions...</p>
//       ) : auctions.length === 0 ? (
//         <p className="text-center text-xl">No active auctions</p>
//       ) : (
//         <div className="flex flex-wrap gap-8 justify-center">
//           {auctions.map((auction) => (
//             <NFTCard key={auction.itemId} {...auction} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuctionPage;

import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader } from "../components/common";
import { getMarketContract, getNFTContract, generateItem } from "../context";
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
          const meta = await loadNFTMetadata(
            a.tokenId.toString(), nftContract
          );

          return {
            itemId: a.itemId.toString(),
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

  const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
};

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

      <h1 className="text-4xl font-bold text-center text-blue-500 mb-6">
        Active Auctions
      </h1>

      {loading ? (
        <Loader className="w-[400px] h-[400px] mx-auto" size={400} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 w-full px-5 mx-auto">
          {activeAuctions.length === 0 && (
            <p className="text-center text-gray-400 col-span-full">
              No active auctions right now.
            </p>
          )}

          {activeAuctions.map(a => {
            const ended = Date.now() / 1000 > a.endTime;

            return (
              <div key={a.itemId} className="bg-gradient-to-b rounded-3xl shadow-xl border border-[#333] p-6 hover:scale-105 transition-transform duration-300 flex flex-col">
                <div className="w-full max-w-[500px] mb-4">
                <Image
                  unoptimized
                  src={a.image || ""}
                  alt={a.name || ""}
                  width={300}
                  height={300}
                  layout="responsive"
                  className="rounded-xl"
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
                </div>

                <h2 className="text-xl font-bold mt-2">{a.name}</h2>
                <p>Token ID: {a.tokenId}</p>

                <div className="flex flex-col w-full mb-4">
                  <div className="flex justify-between text-white mb-1">
                    <span>Start Price:</span>
                    <span>{a.startPrice} ETH</span>
                  </div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Highest Bid:</span>
                    <span>{a.highestBid} ETH</span>
                  </div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Highest Bidder:</span>
                    <span>{shortenAddress(a.highestBidder)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm mb-1">
                    <span>Ends in:</span>
                    <span>{formatTime(timeLeft[a.itemId])}</span>
                  </div>
                </div>

                {/* Bid Section */}
                {a.active && !ended && (
                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder="Your bid (ETH)"
                      className="p-2 text-black w-full rounded-md focus:outline-none"
                      onChange={(e) =>
                        setBidAmounts({ ...bidAmounts, [a.itemId]: e.target.value })
                      }
                    />
                    <button
                      onClick={() => placeBid(a.itemId)}
                      className="bg-green-500 p-2 rounded-md w-full mt-2 font-bold"
                    >
                      Place Bid
                    </button>
                  </div>
                )}

                {/* Claim Section */}
                {ended && !a.claimed && (
                  <button
                    onClick={() => claimAuction(a.itemId)}
                    className="bg-yellow-500 p-2 rounded-md w-full mt-3 font-bold"
                  >
                    Claim Auction
                  </button>
                )}

                {a.claimed && (
                  <p className="text-green-400 mt-2 font-bold">✔ Claimed</p>
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
