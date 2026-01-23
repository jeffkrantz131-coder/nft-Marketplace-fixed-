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
import { DATA_URL } from "../../../utils";

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


//   return (
//     <div className="bg-gradient text-white p-5">
//       <Head>
//         <title>NFT {id && id}</title>
//         <meta name="description" content="NFT" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       {!nft ? (
//         <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
//       ) : (
//         <section className="w-[70%] mx-auto my-0 grid grid-cols-[400px_1fr] items-center justify-center">
//           <div className="w-[350px] h-[350px] cursor-pointer hover:opacity-80" onClick={() => setFullImage(true)}>
//             <Image
//               unoptimized
//               src={nft!.image}
//               alt="Picture of the author"
//               className="rounded-2xl mt-4"
//               layout="responsive"
//               width={300}
//               height={300}
//               blurDataURL={DATA_URL}
//               placeholder="blur"
//             />
//           </div>
//           <div className="self-start justify-center pt-[40px] pl-[50px]">
//             <div className="flex flex-row">
//               <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500">
//                 <Image
//                   unoptimized
//                   src='/2.jpg'
//                   alt="avatar"
//                   className="rounded-full"
//                   layout="responsive"
//                   width={40}
//                   height={40}
//                 />
//               </div>
//               <h5 className="text-gray-400 items-start px-3">Creator</h5>
//             </div>
//             <h2 className="text-3xl py-3">{nft.name}</h2>
//             <h2 className="text-4xl py-3">$ {nft.price} eth</h2>
//             <h4 className="text-lg py-3">{getFormatDate(nft.createAt)}</h4>
//             <div className="flex items-center justify-start pt-5">
//               <ul className="flex flex-row gap-5 text-lg">
//                 <li
//                   className={`cursor-pointer ${
//                     active === 1 ? "border-b-4 border-b-blue-700" : ""
//                   }`}
//                   onClick={() => seActive(1)}
//                 >
//                   Ownership
//                 </li>
//                 <li
//                   className={`cursor-pointer ${
//                     active === 2 ? "border-b-4 border-b-blue-700" : ""
//                   }`}
//                   onClick={() => seActive(2)}
//                 >
//                   Creator
//                 </li>
//               </ul>
//             </div>
//             {active === 1 ? (
//               <div className="pt-3">
//                 {nft.sold ? (
//                   <div className="flex items-center justify-start py-3">
//                     <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500">
//                       <Image
//                         unoptimized
//                         src='/2.jpg'
//                         alt="avatar"
//                         className="rounded-full"
//                         layout="responsive"
//                         width={40}
//                         height={40}
//                       />
//                     </div>
//                     <h4 className="text-xl px-1">
//                     <a className=" flex items-center hover:text-blue-500" target="_blank" href={`https://mumbai.polygonscan.com/address/${nft.owner}`}> <span>{nft.owner}</span> <ExternalLinkIcon className="w-5 h-5" /></a>
//                     </h4>
//                   </div>
//                 ) : (
//                   <h3>Has no owner</h3>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center justify-start py-3">
//                 <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500">
//                   <Image
//                     unoptimized
//                     src='/2.jpg'
//                     alt="avatar"
//                     className="rounded-full"
//                     layout="responsive"
//                     width={40}
//                     height={40}
//                   />
//                 </div>
//                 <h4 className="text-xl px-5">
//                   <a className=" flex items-center hover:text-blue-500" target="_blank" href={`https://mumbai.polygonscan.com/address/${nft.creator}`}> <span>{nft.creator}</span> <ExternalLinkIcon className="w-5 h-5" /></a>
//                 </h4>
//               </div>
//             )}
//           </div>
//           <div className="py-3 flex flex-col gap-4">
//             <Link href={`/nft/${id}/details`}>
//               <div className="border-2 border-white rounded-3xl w-[350px] p-4 cursor-pointer">
//                 <h4 className="text-center text-xl">Details</h4>
//               </div>
//             </Link>
            
            
//             {nft.sold && nft.owner === signer &&
//               <div className="flex flex-col gap-4 w-[350px]">
//                 <Link href={`/nft/${id}/details/startauction`}>
//                   <div className="border-2 border-blue rounded-3xl w-[350px] h-12 p-2 cursor-pointer bg-gradient-to-r from-[#fa1199] to-[#fa7111]">
//                     <h4 className="text-center text-xl">Auction</h4>
//                   </div>
//                 </Link>
//               </div>
            
//             }

//             {!nft.sold && nft.seller !== signer &&
//               (!txWait ? (
//                 <button
//                   className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl p-2 w-full max-w-[350px] h-12 text-black font-bold hover:opacity-90 mt-3"

//                   onClick={buyNft}
//                 >
//                   Buy
//                 </button>
//               ) : (
//                 <TransactionProgress />
//               ))}

//               {nft.sold && nft.owner === signer && (
//                 !txWait ? (
//                   <div className="flex flex-row gap-4 w-[350px]">
//                     <input
//                       type="number"
//                       placeholder="Enter price in ETH"
//                       className="h-12 p-2 rounded-3xl text-black w-36 focus:outline-none"
//                       value={resellPrice}
//                       onChange={(e) => setResellPrice(e.target.value)}
//                     />

//                     <button
//                       className="h-12 bg-gradient-to-r from-[#1199fa] to-[#11d0fa] p-2 rounded-3xl  w-full max-w-[350px] text-black font-bold hover:opacity-90 "

//                       onClick={resellNft}
//                     >
//                       Sell
//                     </button>
//                   </div>
//                 ) : (
//                   <TransactionProgress />
//                 )
//               )}

//           </div>
//           { fullImage &&
//           <div className="w-[100%] h-[100%] bg-[#000000a8] absolute top-0 left-0">
//           <div className="w-[800px] h-[800px] absolute translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]">
//             <XIcon className="w-10 h-10 absolute right-[-50px] top-0 z-50 cursor-pointer hover:fill-pink-600" onClick={() => setFullImage(false)}/>
//             <Image
//               unoptimized
//               src={nft!.image}
//               alt="Picture of the author"
//               className="rounded-2xl mt-4"
//               layout="responsive"
//               width={600}
//               height={600}
//               blurDataURL={DATA_URL}
//               placeholder="blur"
//             />
//           </div>
//           </div>}
//         </section>
//       )}
//     </div>
//   );
// };

// export default NFTItem;

return (
    <div className="bg-gradient text-white min-h-screen p-5">
      <Head>
        <title>NFT {id && id}</title>
        <meta name="description" content="NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!nft ? (
        <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
      ) : (
        <section className="w-[80%] mx-auto grid lg:grid-cols-[400px_1fr] gap-10 items-center justify-center">
          
          {/* NFT Image with animated rainbow neon border */}
          <div className="relative w-[350px] h-[350px] rounded-2xl mx-auto">
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
          <div className="flex flex-col justify-start gap-5">
            
            {/* Creator Info */}
            <div className="flex items-center gap-3">
              <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500 overflow-hidden">
                <Image
                  unoptimized
                  src="/2.jpg"
                  alt="avatar"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
              <h5 className="text-gray-400">Creator</h5>
            </div>

            {/* NFT Name & Price */}
            <h2 className="text-3xl font-bold">{nft.name}</h2>
            <h2 className="text-4xl font-extrabold text-gradient">
              $ {nft.price} ETH
            </h2>
            <h4 className="text-lg text-gray-400">{getFormatDate(nft.createAt)}</h4>

            {/* Ownership / Creator Tabs */}
            <ul className="flex flex-row gap-5 text-lg border-b border-gray-600 pb-2">
              <li
                className={`cursor-pointer ${active === 1 ? "border-b-4 border-blue-500 font-bold" : ""}`}
                onClick={() => seActive(1)}
              >
                Ownership
              </li>
              <li
                className={`cursor-pointer ${active === 2 ? "border-b-4 border-blue-500 font-bold" : ""}`}
                onClick={() => seActive(2)}
              >
                Creator
              </li>
            </ul>

            {/* Owner / Creator Info */}
            <div className="pt-3 flex flex-col gap-3">
              {active === 1 ? (
                nft.sold ? (
                  <div className="flex items-center gap-3">
                    <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500 overflow-hidden">
                      <Image
                        unoptimized
                        src="/2.jpg"
                        alt="avatar"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </div>
                    <a
                      className="flex items-center hover:text-blue-500"
                      target="_blank"
                      href={`https://mumbai.polygonscan.com/address/${nft.owner}`}
                    >
                      <span>{nft.owner}</span>
                      <ExternalLinkIcon className="w-5 h-5 ml-1" />
                    </a>
                  </div>
                ) : (
                  <h3 className="text-gray-400">Has no owner</h3>
                )
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-[50px] h-[50px] border-2 rounded-full border-blue-500 overflow-hidden">
                    <Image
                      unoptimized
                      src="/2.jpg"
                      alt="avatar"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <a
                    className="flex items-center hover:text-blue-500"
                    target="_blank"
                    href={`https://mumbai.polygonscan.com/address/${nft.creator}`}
                  >
                    <span>{nft.creator}</span>
                    <ExternalLinkIcon className="w-5 h-5 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col gap-4 pt-5">
              
              {/* Detail Button */}
              <Link href={`/nft/${id}/details`}>
                <div className="border-2 border-white rounded-3xl p-4 text-center font-bold hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                  Details
                </div>
              </Link>

              {/* Auction Button if owner */}
              {nft.sold && nft.owner === signer && (
                <Link href={`/nft/${id}/details/startauction`}>
                  <div className="w-full p-3 rounded-3xl text-center font-bold bg-gradient-to-r from-[#fa1199] to-[#fa7111] hover:scale-105 transition-transform duration-300 cursor-pointer">
                    Auction
                  </div>
                </Link>
              )}

              {/* Buy Button if not owner */}
              {!nft.sold && nft.seller !== signer &&
                (!txWait ? (
                  <button
                    onClick={buyNft}
                    className="w-full p-3 rounded-3xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] text-black font-bold hover:scale-105 transition-transform duration-300"
                  >
                    Buy
                  </button>
                ) : <TransactionProgress />)
              }

              {/* Sell Section if owner */}
              {nft.sold && nft.owner === signer &&
                (!txWait ? (
                  <div className="flex gap-3 w-full">
                    <input
                      type="number"
                      placeholder="Enter price in ETH"
                      value={resellPrice}
                      onChange={(e) => setResellPrice(e.target.value)}
                      className="w-1/2 h-12 p-2 rounded-3xl text-black focus:outline-none"
                    />
                    <button
                      onClick={resellNft}
                      className="w-1/2 h-12 rounded-3xl bg-gradient-to-r from-[#1199fa] to-[#11d0fa] text-black font-bold hover:scale-105 transition-transform duration-300"
                    >
                      Sell
                    </button>
                  </div>
                ) : <TransactionProgress />)
              }
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
        </section>
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