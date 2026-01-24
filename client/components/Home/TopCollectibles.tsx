

import { ethers } from 'ethers';
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from 'react'
import { CollectiblesMenu, NFTCardItems } from '../../components'
import { fetchMarketItems, getItems, getMarketContract, getNFTContract, MarketContext } from '../../context';
import { IItem } from '../../interfaces'
import { Loader } from '../common';

export const TopCollectibles = () => {
  const [items, setItems] = useState<IItem[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    (async () => {
     try {
       setIsLoading(true);
       const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_VERCEL_RPC_URL);
       const marketContract = await getMarketContract(provider);
       const nftContract = await getNFTContract(provider)
       if(!marketContract) return; 
       if(!nftContract) return; 
       const [nfts] = await fetchMarketItems({marketContract: marketContract, offSet: 0, limit: 6, solded: 0 });
       const genItems = await getItems(nftContract, nfts);
       setItems(genItems);
       setIsLoading(false);  
     } catch (error) {
       setIsLoading(false);  
     }
     
    })()
   },[]);
 

  return (
      isLoading ? (
        <Loader className='relative w-[150px] h-[150px] bg-gradient my-0 mx-auto' size={150} /> ) : (
          <div className="relative w-[75%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_100px_rgba(0,255,255,0.15)]">

          <h2 className='text-center text-6xl font-black mb-6 
                        text-blue-400 drop-shadow-[0_0_20px_cyan]'>Top Collectibles</h2>
          <CollectiblesMenu/>
          <NFTCardItems items={items} message="Connect your wallet" isLoading={isLoading}/>
        </div>

      )
  )
}
