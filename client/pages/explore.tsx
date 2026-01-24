import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { NFTCardItems } from "../components";
import { Loader } from "../components/common";
import { MarketContext } from "../context";

const Marketplace:NextPage = () => {
  const { NFTFilterItems, getMarketPlaceItems} = useContext(MarketContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { 
    showMore();
  },[]);


  const showMore = async () => {
      setIsLoading(true);
      await getMarketPlaceItems();
      setIsLoading(false);
  }

  return (
    <section className="bg-gradient text-white py-5">
      <div className="relative w-[75%] mx-auto p-8 
                        bg-gradient backdrop-blur-2xl 
                        border border-none rounded-3xl shadow-[0_0_200px_rgba(0,255,255,0.15)]">
         <h2 className="text-center text-6xl font-black mb-8 
                   text-blue-400 drop-shadow-[0_0_20px_cyan]">Marketplace</h2>
         <NFTCardItems items={NFTFilterItems} isLoading={isLoading}/>
      </div>
      <div className="flex justify-center items-center">
      { isLoading && <Loader className='w-[150px] h-[150px]' size={150} /> }
      </div>
      
    </section>
  )
}

export default Marketplace;
