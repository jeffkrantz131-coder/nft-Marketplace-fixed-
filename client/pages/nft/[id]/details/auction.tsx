import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid'
import { Loader } from "../../../../components/common";
import { generateItem, getMarketContract, getNFTContract, IItem } from "../../../../context";
import { DATA_URL } from "../../../../utils";

const NFTDetails:NextPage = () => {
  const [nft, setNft] = useState<IItem | undefined>(undefined);
  const [fullImage, setFullImage] = useState(false); 
  const [startingPrice, setStartingPrice] = useState(""); // auction price
  const [auctionDuration, setAuctionDuration] = useState(""); // duration in hours
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
   if(id) {
     (async () => {    
       const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL);
       const marketContract = await getMarketContract(provider);
       const nftContract = await getNFTContract(provider)
       const item = await marketContract.getItemById(parseInt(id as string))
       const newItem = await generateItem(item, nftContract);
       setNft(newItem);
     })();
   }
  },[id]);
  
  const getFormatDate = (unformatDate:string):string => {
    const date = new Date(parseInt(unformatDate) * 1000 );
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
  } 

  return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>NFT Details {id && id}</title>
        <meta name="description" content="NFT Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    {
      !nft ? (<Loader className='w-[500px] h-[500px] mx-auto my-0 py-5' size={500} />)  :
      (<section className="w-[80%] mx-auto my-0">
         <h2 className="bold text-blue-600 text-4xl text-center mb-6">{nft.name}</h2>
          <div className="grid grid-cols-[1fr_350px] gap-[20px] justify-center items-start">
            {/* Auction Input */}
            <div className="flex flex-col gap-4 w-2/3">
                <label className="font-bold text-pink-600">Starting Price (ETH)</label>
                <input
                    type="number"
                    placeholder="Enter starting price"
                    className="p-2 rounded-md text-black w-full"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                />

                <label className="font-bold text-pink-600">Auction Duration (Hours)</label>
                <input
                    type="number"
                    placeholder="Enter duration"
                    className="p-2 rounded-md text-black w-full"
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                />

                <button
                    className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl p-2 w-full text-black font-bold hover:opacity-90 mt-3"
                    // onClick={startAuction}
                    disabled={loading}
                >
                    {loading ? "Starting Auction..." : "Start Auction"}
                </button>
                </div>
            {/* NFT Image */}
            <div className="flex flex-col items-center">
              <div
                className="w-[350px] h-[350px] cursor-pointer hover:opacity-80"
                onClick={() => setFullImage(true)}
              >
                <Image
                  unoptimized
                  src={nft!.image}
                  alt={nft!.name}
                  className="rounded-2xl mt-4"
                  layout="responsive"
                  width={350}
                  height={350}
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
              </div>
            </div>
          </div>

          {/* Fullscreen Image Overlay */}
          {fullImage && (
            <div className="w-[100%] h-[100%] bg-[#000000a8] absolute top-0 left-0 flex justify-center items-center">
              <div className="relative w-[800px] h-[800px]">
                <XIcon
                  className="w-10 h-10 absolute right-[-50px] top-0 z-50 cursor-pointer hover:fill-pink-600"
                  onClick={() => setFullImage(false)}
                />
                <Image
                  unoptimized
                  src={nft!.image}
                  alt={nft!.name}
                  className="rounded-2xl mt-4"
                  layout="responsive"
                  width={800}
                  height={800}
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default NFTDetails;
