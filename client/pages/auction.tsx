import { useContext, useEffect, useState } from "react";
import { MarketContext } from "../context/marketContext";
import { NFTCard } from "../components/collections/NFTCard";
import { ethers } from "ethers";

interface IAuctionItem {
  itemId: string;
  auctionId: string;
  image: string;
  name: string;
  creator: string;
  price: string; // current highest bid or start price
  endTime: number;
}

const AuctionPage = () => {
  const { marketContract, nftContract, web3Provider } = useContext(MarketContext);
  const [auctions, setAuctions] = useState<IAuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketContract || !nftContract) return;

    const fetchAuctions = async () => {
      try {
        setLoading(true);

        // 👇 Replace this with your contract function that returns auctions
        const allAuctions = await marketContract.getAllAuctions();

        const activeAuctions = allAuctions.filter((a: any) => a.active);

        const items = await Promise.all(
          activeAuctions.map(async (auction: any) => {
            const tokenUri: string = await nftContract.tokenURI(auction.tokenId);
            const ipfsUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
            const metadata = await fetch(ipfsUri).then((res) => res.json());

            return {
              itemId: auction.tokenId.toString(),
              auctionId: auction.itemId.toString(),
              image: metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
              name: metadata.name,
              creator: auction.creator,
              price: ethers.utils.formatEther(
                auction.highestBid.gt(0) ? auction.highestBid : auction.startPrice
              ),
              endTime: Number(auction.endTime),
            };
          })
        );

        setAuctions(items);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [marketContract, nftContract]);

  return (
    <div className="bg-gradient text-white py-5">
      <h1 className="text-4xl text-center font-bold text-blue-600 mb-8">
        Active Auctions
      </h1>

      {loading ? (
        <p className="text-center text-xl">Loading auctions...</p>
      ) : auctions.length === 0 ? (
        <p className="text-center text-xl">No active auctions</p>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {auctions.map((auction) => (
            <NFTCard key={auction.itemId} {...auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionPage;
