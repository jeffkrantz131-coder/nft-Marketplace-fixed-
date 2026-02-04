import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
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
  
  
  const startAuction = async () => {
  if (!startingPrice || !auctionDuration || !nft) {
    alert("Please enter starting price, duration, and select an NFT");
    return;
  }

  try {
    setLoading(true);

    // 1️⃣ Provider & Signer
    const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // 2️⃣ Contracts
    const marketContract = await getMarketContract(provider, signer);
    const nftContract = await getNFTContract(provider, signer);

    const tokenId = nft.tokenId;
    
    
    const owner = await nftContract.ownerOf(tokenId);
    // 3️⃣ Check ownership
    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
      alert("Only the owner can start an auction");
      return;
    }
    
    // 4️⃣ Approve market contract if needed
    const approvedAddress = await nftContract.getApproved(tokenId);
    if (approvedAddress.toLowerCase() !== marketContract.address.toLowerCase()) {
      const approveTx = await nftContract.approve(marketContract.address, tokenId);
      await approveTx.wait();
    }

    // 5️⃣ Convert inputs
    const startPriceWei = ethers.utils.parseEther(startingPrice);
    const durationSeconds = Number(auctionDuration) * 60 * 60;

    if (startPriceWei.lte(0)) {
      alert("Start price must be greater than 0");
      return;
    }
    if (durationSeconds <= 0) {
      alert("Duration must be greater than 0");
      return;
    }

    // 6️⃣ Call createAuction
    const tx = await marketContract.createAuction(
      nftContract.address,
      tokenId,
      startPriceWei,
      durationSeconds
    );
    await tx.wait();

    // 7️⃣ Redirect
    router.push("/auction");

  } catch (err: any) {
    console.error("Auction creation failed:", err);
    alert(err?.reason || err?.message || "Auction creation failed");
  } finally {
    setLoading(false);
  }
};





  return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>Auction Details {id && id}</title>
        <meta name="description" content="NFT Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    {
      !nft ? (<Loader className='w-[500px] h-[500px] mx-auto my-0 py-5' size={500} />)  :
      (<div className="relative w-[60%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_100px_rgba(0,255,255,0.15)] mt-[50px]">
          <h1 className="text-center text-6xl font-black mb-8 
                   text-blue-400 drop-shadow-[0_0_20px_cyan]">
            Auction
          </h1>
          
            
          <div className="flex flex-row h-full mx-auto">
            {/* <div className="flex flex-col items-start h-full"> */}
              <div className="relative w-[350px] h-[350px] rounded-2xl mx-auto items-start h-full">
                <div className="absolute -inset-1 rounded-2xl z-0 animate-rainbow-border pointer-events-none"></div>
                  <Image
                    unoptimized
                    src={nft!.image}
                    alt={nft.name}
                    className="relative z-10 rounded-2xl"
                    width={350}
                    height={350}
                    placeholder="blur"
                    blurDataURL={DATA_URL}
                  />
              </div>
            {/* </div> */}

            <div className="flex flex-col mx-auto">
                <div>
                    <label className="text-1xl font-black mb-8 
                                      text-blue-400 drop-shadow-[0_0_10px_cyan]">Starting Price (ETH)</label>
                  <input
                    type="number"
                    placeholder="Enter starting price"
                    className="mt-2 w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/70 
                              border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                              [&::-moz-number-spin-button]:appearance-none"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                  />
                </div>
                
                <div className="mt-5">
                    <label className="text-1xl font-black mb-8 
                                      text-blue-400 drop-shadow-[0_0_10px_cyan]">Auction Duration (Hour)</label>
                    <input
                    type="number"
                    placeholder="Enter duration"
                    className="mt-2 w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/70 
                              border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                              [&::-moz-number-spin-button]:appearance-none"
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                    />
                </div>
                {/* Tailwind + global CSS classes */}
                <style global jsx>{`
                  @keyframes rainbowBorder {
                    0% { border: 4px solid red; }
                    16% { border: 4px solid orange; }
                    32% { border: 4px solid yellow; }
                    48% { border: 4px solid green; }
                    64% { border: 4px solid blue; }
                    80% { border: 4px solid indigo; }
                    100% { border: 4px solid violet; }
                  }
                  .animate-rainbow-border {
                    animation: rainbowBorder 4s linear infinite;
                  }
                  .text-gradient {
                    background: linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #9900ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                `}</style>

                <button
                    className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl p-2 w-full text-black font-bold hover:opacity-90 mt-[110px]"
                    onClick={startAuction}
                    disabled={loading}
                >
                    {loading ? "Starting Auction..." : "Start Auction"}
                </button>
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
        </div>
      )}
    </div>
  );
};

export default NFTDetails;
