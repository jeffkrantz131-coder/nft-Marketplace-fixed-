

import { ethers } from 'ethers';
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from 'react'
import { CollectiblesMenu, NFTCardItems } from '../../components'
import { fetchMarketItems, getItems, getMarketContract, getNFTContract, MarketContext } from '../../context';
import { IItem } from '../../interfaces'
import { Loader } from '../common';

 const TopCollectibles = () => {
  const [items, setItems] = useState<IItem[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [allNFTs, setAllNFTs] = useState<IItem[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<IItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTime, setSelectedTime] = useState("All Time");


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
       setAllNFTs(genItems);
       setIsLoading(false);  
     } catch (error) {
       setIsLoading(false);  
     }
     
    })()
   },[]);

  useEffect(() => {
  let filtered = [...allNFTs];

  // 1️⃣ Filter by category
  if (selectedCategory !== "All Categories") {
    filtered = filtered.filter(nft => nft.category === selectedCategory);
  }

  // 2️⃣ Filter by day/time
  if (selectedTime !== "All Time") {
    const now = Date.now();
    let duration = 0;

    switch (selectedTime) {
      case "Today":
        duration = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "Last 7 Days":
        duration = 7 * 24 * 60 * 60 * 1000;
        break;
      case "Last 30 Days":
        duration = 30 * 24 * 60 * 60 * 1000;
        break;
    }

    filtered = filtered.filter(nft => {
      const nftTimestamp = Number(nft.createAt); // convert to number
      return now - nftTimestamp * 1000 <= duration;
    });
  }

  setFilteredNFTs(filtered);
}, [allNFTs, selectedCategory, selectedTime]);
 

  return (
      isLoading ? (
        <Loader className='relative w-[150px] h-[150px] bg-gradient my-0 mx-auto' size={150} /> ) : (
          <div className="relative w-[75%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_100px_rgba(0,255,255,0.15)] mb-[70px]">

          <h2 className="text-center text-6xl font-black mb-6 bg-gradient-to-r from-[#1199fa] to-[#11d0fa] bg-clip-text text-transparent"
              style={{ textShadow: '0 0 20px #11d0fa, 0 0 40px #1199fa' }}>
              Top Collectibles
          </h2>

          <CollectiblesMenu
            onCategoryChange={setSelectedCategory}
            onTimeChange={setSelectedTime}
          />

          <NFTCardItems items={filteredNFTs} message="No Cards..." isLoading={isLoading}/>

          
        </div>

      )
  )
}

export default TopCollectibles;