import { FC } from "react";
import Image from "next/image";
import { IItem } from "../../interfaces";
import { DATA_URL_DARK, shortenAddress } from "../../utils";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export const NFTCard: FC<IItem> = (item) => {
  const { image, price, name, creator, itemId } = item;
  const id = ethers.BigNumber.from(itemId).toNumber();
  const router = useRouter();

  const goTo = () => router.push(`/nft/${id}`);

  return (
    <div
      onClick={goTo}
      className="relative w-[250px] rounded-3xl overflow-hidden cursor-pointer
                 bg-gray-100/30 backdrop-blur-md border border-gray-300
                 shadow-xl hover:shadow-[0_0_60px_rgba(255,0,255,0.6)]
                 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Rainbow Glow Overlay - constantly animated */}
      <div className="absolute inset-0 rounded-3xl blur-xl pointer-events-none rainbow-gradient"></div>

      {/* NFT Image */}
      <div className="relative w-full h-[250px] overflow-hidden rounded-t-3xl">
        <Image
          src={image}
          alt={name}
          width={250}
          height={250}
          className="object-cover transition-transform duration-700 hover:scale-105"
          unoptimized
          blurDataURL={DATA_URL_DARK}
          placeholder="blur"
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-white">
          {price} ETH
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 bg-gray-100/30 backdrop-blur-md rounded-b-3xl">
        <h4 className="text-lg font-bold truncate text-gray-900">{name || "Untitled NFT"}</h4>

        {/* Creator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {creator.slice(2, 4).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="text-gray-500">Creator</p>
            <p className="font-semibold text-gray-800 truncate">{shortenAddress(creator)}</p>
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
    </div>
  );
};
