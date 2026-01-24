import { ExternalLinkIcon, XIcon } from "@heroicons/react/solid";
import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader, TransactionProgress } from "../../../components/common";
import { IItem, MarketContext, generateItem, getMarketContract, getNFTContract } from "../../../context";
import { buyNFT } from "../../../context/marketContract";
import { resellMarketItem } from "../../../context/marketContract";
import { DATA_URL, shortenAddress } from "../../../utils";

const NFTItem: NextPage = () => {
  const { signer, resetNFTtems, marketContract, nftContract } = useContext(MarketContext);
  const [nft, setNft] = useState<IItem | undefined>(undefined);
  const [active, seActive] = useState(1);
  const [fullImage, setFullImage] = useState(false); 
  const [resellPrice, setResellPrice] = useState("");
  const [txWait, setTxWait] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id) {
      (async () => {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL);
        const marketContract = await getMarketContract(provider);
        const nftContract = await getNFTContract(provider)
        const item = await marketContract.getItemById(parseInt(id as string));
        const newItem = await generateItem(item, nftContract);
        setNft(newItem);
      })();
    }
    
  }, [id]);

  const getFormatDate = (unformatDate:string):string => {
    const date = new Date(parseInt(unformatDate) * 1000 );
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
  } 

  const buyNft = async () => {
    if(!signer) {
      toast.info("Please connect your wallet!", {
        autoClose: 3000
      });
      return;
    }
    setTxWait(true);
    let toastTx = toast.loading("Please wait...", { position: toast.POSITION.BOTTOM_RIGHT });
    const price = ethers.utils.parseUnits(nft!.price, "ether");
    if(!marketContract || !nftContract) return;
    const res = await buyNFT({
      marketContract,
      nftContract,
      itemId: nft!.tokenId,
      price,
    });
    if (res) {
      toast.update(toastTx, {
        render: "Tx Ok",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT
      });
      resetNFTtems();
      router.push("/dashboard");
    } else {
      setTxWait(false);
      toast.update(toastTx, {
        render: "TX Fail",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };

  const resellNft = async () => {
  if (!signer) {
    toast.info("Connect your wallet first!");
    return;
  }
  if (!resellPrice || parseFloat(resellPrice) <= 0) {
    toast.info("Enter a valid price");
    return;
  }
  if (!marketContract || !nftContract || !nft) return;

  const priceInWei = ethers.utils.parseUnits(resellPrice, "ether");
  const toastTx = toast.loading("Listing NFT...", { position: "bottom-right" });
  
  try {
    const tx = await marketContract.resellMarketItem(
      nftContract.address,
      nft.itemId, // use your MarketItem ID, not tokenId
      priceInWei,
      { value: await marketContract.getListingFee() }
    );
    await tx.wait();

    toast.update(toastTx, {
      render: "NFT Listed for Resale!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      position: "bottom-right",
    });

    resetNFTtems(); // refresh dashboard/market
    router.push("/dashboard");
  } catch (err) {
    console.error("Resell error:", err);
    toast.update(toastTx, {
      render: "Resell failed",
      type: "error",
      isLoading: false,
      autoClose: 3000,
      position: "bottom-right",
    });
  }
};

return (
    <div className="bg-gradient text-white p-5">
      <Head>
        <title>NFT {id && id}</title>
        <meta name="description" content="NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      {!nft ? (
        <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
      ) : (
          
        <div className="relative w-[60%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_100px_rgba(0,255,255,0.15)] mt-[50px]">
          
          <h1 className="text-center text-6xl font-black mb-8 
                   text-blue-400 drop-shadow-[0_0_20px_cyan]">
            Trade
          </h1>
          <div className="flex flex-row  h-full mx-auto">
            <div className="relative w-[350px] h-[350px] rounded-2xl ml-[20px] items-start h-full">
              {/* Animated border */}
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
                  onClick={() => setFullImage(true)}
                />
            </div>

          {/* NFT Details */}
          <div className="flex flex-col justify-start gap-6 mx-auto">           
            {/* NFT Name & Price */}
            <h2 className="text-3xl font-bold">{nft.name}</h2>
            <h2 className="text-4xl font-extrabold text-gradient">
              $ {nft.price} ETH
            </h2>
            <h4 className="text-lg text-gray-400">{getFormatDate(nft.createAt)}</h4>
            <h4 className="text-lg text-gray-400">{shortenAddress(nft.creator)}</h4>
            

            {/* Buttons Section */}
          <div className="flex flex-col gap-4 pt-5">

          {/*Auction Buttons */}
          <div className="flex flex-col gap-3">
            
            {nft.sold && nft.owner === signer && (
              <Link href={`/nft/${id}/details/startauction`}>
                <div className="w-full p-3 text-center font-bold rounded-3xl 
                                bg-gradient-to-r from-[#fa1199] to-[#fa7111] 
                                hover:scale-105 hover:shadow-lg transition-transform duration-300 cursor-pointer">
                  Auction
                </div>
              </Link>
            )}
          </div>

  {/* Buy Button if not owner */}
  {!nft.sold && nft.seller !== signer &&
    (!txWait ? (
      <button
        onClick={buyNft}
        className="w-full p-3 rounded-3xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] 
                   text-black font-bold hover:scale-105 hover:shadow-lg transition-transform duration-300 mt-10"
      >
        Buy
      </button>
    ) : <TransactionProgress />)
  }

  {/* Sell Section if owner */}
  {nft.sold && nft.owner === signer &&
    (!txWait ? (
      <div className="flex gap-3 w-full">
        <button
          onClick={resellNft}
          className="w-1/2 h-12 rounded-3xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] 
                     text-black font-bold hover:scale-105 hover:shadow-lg transition-transform duration-300"
        >
          Sell
        </button>

        <input
          type="number"
          placeholder=" Enter Price"
          value={resellPrice}
          onChange={(e) => setResellPrice(e.target.value)}
          className="w-1/2 h-12 rounded-3xl bg-white/10 text-white placeholder-white/70 
             border border-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
             [&::-moz-number-spin-button]:appearance-none"
        />
        
      </div>
    ) : <TransactionProgress />)
  }
          </div>

          {/* NFT Image with animated rainbow neon border */}
          

</div>

          </div>

          {/* Fullscreen Image */}
          {fullImage && (
            <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
              <div className="relative w-[800px] h-[800px]">
                <XIcon
                  className="w-10 h-10 absolute top-0 right-0 cursor-pointer hover:text-pink-500"
                  onClick={() => setFullImage(false)}
                />
                <Image
                  unoptimized
                  src={nft!.image}
                  alt="Picture of the author"
                  className="rounded-2xl"
                  width={800}
                  height={800}
                  placeholder="blur"
                  blurDataURL={DATA_URL}
                />
              </div>
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};

export default NFTItem;