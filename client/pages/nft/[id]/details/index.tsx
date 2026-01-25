// import { ethers } from "ethers";
// import { NextPage } from "next";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid'
// import { Loader } from "../../../../components/common";
// import { generateItem, getMarketContract, getNFTContract, IItem } from "../../../../context";
// import { DATA_URL } from "../../../../utils";

// const NFTDetails:NextPage = () => {
//   const [nft, setNft] = useState<IItem | undefined>(undefined);
//   const [fullImage, setFullImage] = useState(false); 
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//    if(id) {
//      (async () => {    
//        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL);
//        const marketContract = await getMarketContract(provider);
//        const nftContract = await getNFTContract(provider)
//        const item = await marketContract.getItemById(parseInt(id as string))
//        const newItem = await generateItem(item, nftContract);
//        setNft(newItem);
//      })();
//    }
//   },[id]);
  
//   const getFormatDate = (unformatDate:string):string => {
//     const date = new Date(parseInt(unformatDate) * 1000 );
//     return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
//   } 

//   return (
//     <div className="bg-gradient text-white p-5">
//       <Head>
//         <title>NFT Details {id && id}</title>
//         <meta name="description" content="NFT Details" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//     {
//       !nft ? (<Loader className='w-[500px] h-[500px] mx-auto my-0 py-5' size={500} />)  :
//       (<section className="w-[80%] mx-auto my-0">
//          <h2 className="bold text-blue-600 text-4xl text-center">Details</h2>
//          <div className="grid grid-cols-[1fr_350px] gap-[20px] justify-center items-center">
//            <div>
//              {/* <h4 className="py-3"><span className="bold text-pink-600 text-lg">Item-ID:</span> {ethers.BigNumber.from(nft.itemId).toNumber()}</h4> */}
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Name:</span> {nft.name}</h4> 
//              {/* <h4 className="py-3 flex items-center">
//               <span className="bold text-pink-600 text-lg pr-2">Creator:</span>
//               <a className="text-blue-500 flex" target="_blank" href={`https://mumbai.polygonscan.com/address/${nft.seller}`}> <span>{nft.seller}</span> <ExternalLinkIcon className="w-5 h-5" /></a>
//              </h4>  */}
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Created At:</span> {getFormatDate(nft.createAt)}</h4> 
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Description:</span> {nft.description}</h4>              
//              {/* <h4 className="py-3 flex items-center">
//               <span className="bold text-pink-600 text-lg pr-2">Owner:</span>
//               {nft.sold ?
//                 <a className="text-blue-500 flex" target="_blank" href={`https://mumbai.polygonscan.com/address/${nft.owner}`}> <span>{nft.owner}</span> <ExternalLinkIcon className="w-5 h-5" /></a>
//                 : <>{nft.owner}</>
//               }
//              </h4> */}
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Creator:</span> {nft.creator}</h4>
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Price:</span> {nft.price} eth</h4> 
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Sold:</span> {nft.sold ? 'sold out' : 'unsold'}</h4> 
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">Token-ID:</span> {ethers.BigNumber.from(nft.tokenId).toNumber()}</h4>
//              <h4 className="py-3"><span className="bold text-pink-600 text-lg">NFT Url:</span> <a className="text-blue-500" target="_blank" href={nft.image}>{nft.image}</a></h4> 
//            </div>
//            <div className="flex flex-col ">
//              <div className="w-[350px] h-[350px] cursor-pointer hover:opacity-80" onClick={() => setFullImage(true)}>
//                <Image
//                  unoptimized
//                  src={nft!.image}
//                  alt="Picture of the author"
//                  className="rounded-2xl mt-4"
//                  layout="responsive"
//                  width={350}
//                 height={350}
//                 blurDataURL={DATA_URL}
//                 placeholder="blur"
//                />
//               </div>
//           <Link href={`/nft/${id}`}>
//             <div className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl w-[300px] p-3 cursor-pointer mx-auto my-3">
//               <h4 className="text-center text-xl">View on market</h4>
//             </div>
//           </Link>
//             </div>
//          </div>
//          { fullImage &&
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
//       </section>) 
//     }  
//     </div>
//   )
// }

// export default NFTDetails;

import { ethers } from "ethers";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, XIcon } from '@heroicons/react/solid';
import { Loader } from "../../../../components/common";
import { generateItem, getMarketContract, getNFTContract, IItem } from "../../../../context";
import { DATA_URL } from "../../../../utils";

const NFTDetails: NextPage = () => {
  const [nft, setNft] = useState<IItem | undefined>(undefined);
  const [fullImage, setFullImage] = useState(false); 
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      (async () => {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL);
        const marketContract = await getMarketContract(provider);
        const nftContract = await getNFTContract(provider);
        const item = await marketContract.getItemById(parseInt(id as string));
        const newItem = await generateItem(item, nftContract);
        setNft(newItem);
      })();
    }
  }, [id]);

  const getFormatDate = (unformatDate: string): string => {
    const date = new Date(parseInt(unformatDate) * 1000);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="bg-gradient text-white min-h-screen p-5">
      <Head>
        <title>NFT Details {id && id}</title>
        <meta name="description" content="NFT Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!nft ? (
        <Loader className="w-[500px] h-[500px] mx-auto my-0 py-5" size={500} />
      ) : (
        <section className="w-[80%] mx-auto my-0">
          <h2 className="text-4xl font-bold text-blue-500 text-center mb-10">NFT Details</h2>

          <div className="grid grid-cols-[1fr_350px] gap-10 justify-center items-center">
            {/* Details Column */}
            <div className="flex flex-col gap-4 text-lg">
              <h4 className="py-2"><span className="font-bold text-pink-500">Name:</span> {nft.name}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Created At:</span> {getFormatDate(nft.createAt)}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Description:</span> {nft.description}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Creator:</span> {nft.creator}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Price:</span> {nft.price} ETH</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Sold:</span> {nft.sold ? 'Sold Out' : 'Unsold'}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">Token-ID:</span> {ethers.BigNumber.from(nft.tokenId).toNumber()}</h4>
              <h4 className="py-2"><span className="font-bold text-pink-500">NFT Url:</span> <a className="text-blue-400 hover:underline" target="_blank" href={nft.image}>{nft.image}</a></h4>
            </div>

            {/* NFT Image Column */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-[350px] h-[350px] rounded-2xl cursor-pointer"
                   onClick={() => setFullImage(true)}>
                {/* Animated Rainbow Border */}
                <div className="absolute -inset-1 rounded-2xl z-0 animate-rainbow-border pointer-events-none"></div>
                <Image
                  unoptimized
                  src={nft!.image}
                  alt="NFT Image"
                  className="relative z-10 rounded-2xl"
                  width={350}
                  height={350}
                  blurDataURL={DATA_URL}
                  placeholder="blur"
                />
              </div>

              {/* Market Link Button */}
              <Link href={`/nft/${id}`}>
                <div className="bg-gradient-to-r from-[#1199fa] to-[#11d0fa] rounded-3xl w-[300px] p-3 cursor-pointer hover:scale-105 transition-transform duration-300 text-center font-bold">
                  View on Market
                </div>
              </Link>
            </div>
          </div>

          {/* Fullscreen Image Modal */}
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
                  alt="NFT Fullscreen"
                  className="rounded-2xl"
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

      {/* Rainbow Neon Animation + Gradient Text */}
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

export default NFTDetails;
