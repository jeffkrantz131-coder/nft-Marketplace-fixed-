// import { FC } from "react";
// import Image from "next/image";
// import { IItem } from "../../interfaces";
// import { DATA_URL_DARK, shortenAddress } from "../../utils";
// import { ethers } from "ethers";
// import { useRouter } from "next/router";


// export const NFTCard: FC<IItem> = (item) => {
//   const { image, price, name, creator, itemId } = item;
//   const id = ethers.BigNumber.from(itemId).toNumber();
//  const router = useRouter();

//   const goTo = () => {
//      router.push(`/nft/${id}`);
//   }

//   return (
//     <div
//       className="bg-white/80 backdrop-blur-lg h-[450px] w-[250px] flex flex-col rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
//              cursor-pointer border border-gray-200"
//       onClick={goTo}
//     >
      
//         <Image
//           unoptimized
//           src={image}
//           alt="Picture of the author"
//           className="flex items-center gap-3 py-3rounded-t-2xl mt-4 rounded-2xl"
//           layout="responsive"
//           width={250}
//           height={350}
//           blurDataURL={DATA_URL_DARK}
//           placeholder="blur"
//         />
      
//       <div className="text-gray-800 h-[250px] w-[350px] p-4 relative flex flex-col justify-between">
//         <h4 className="px-1 py-2 text-2xl font-bold truncate">{name}</h4>
//         <h4 className="px-1 py-1 text-xl font-semibold text-blue-600">$ {price} eth</h4>
//         <div className="flex items-center gap-3 py-3">
//           <div className="w-[48px] h-[48px] border-2 border-blue-500 rounded-full overflow-hidden">
//             <Image
//               unoptimized
//               src='2.jpg'
//               alt="avatar"
//               className="rounded-t-2xl hover:scale-105 transition-transform duration-500"
//               layout="responsive"
//               width={10}
//               height={10}
//             />
//           </div>
//           <h4 className="text-sm font-medium text-gray-600">{shortenAddress(creator)}</h4>
//         </div>
        
//       </div>
//     </div>
//   );
// };
// // import { FC } from "react";
// // import Image from "next/image";
// // import Tilt from "react-parallax-tilt";
// // import { IItem } from "../../interfaces";
// // import { DATA_URL_DARK, shortenAddress } from "../../utils";
// // import { ethers } from "ethers";
// // import { useRouter } from "next/router";

// // export const NFTCard: FC<IItem> = (item) => {
// //   const { image, price, name, creator, itemId } = item;
// //   const id = ethers.BigNumber.from(itemId).toNumber();
// //   const router = useRouter();

// //   const goTo = () => router.push(`/nft/${id}`);

// //   return (
// //     <Tilt
// //       tiltMaxAngleX={10}
// //       tiltMaxAngleY={10}
// //       glareEnable={true}
// //       glareMaxOpacity={0.1}
// //       scale={1.03}
// //       transitionSpeed={400}
// //       className="w-[350px]"
// //     >
// //       <div
// //         onClick={goTo}
// //         className="bg-white rounded-xl border border-gray-200 shadow-sm
// //                    hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
// //       >
// //         {/* NFT IMAGE */}
// //         <div className="w-full aspect-square overflow-hidden">
// //           <Image
// //             src={image}
// //             alt={name}
// //             className="object-cover hover:scale-105 transition-transform duration-300"
// //             width={350}
// //             height={350}
// //             unoptimized
// //             blurDataURL={DATA_URL_DARK}
// //             placeholder="blur"
// //           />
// //         </div>

// //         {/* CARD CONTENT */}
// //         <div className="p-4 space-y-2">
// //           {/* NFT NAME */}
// //           <h4 className="text-lg font-semibold truncate">{name || "Untitled NFT"}</h4>

// //           {/* PRICE ROW */}
// //           <div className="flex justify-between text-sm text-gray-600">
// //             <span>Price</span>
// //             <span className="font-semibold text-gray-900">{price} ETH</span>
// //           </div>

// //           {/* CREATOR */}
// //           <div className="flex items-center gap-2 pt-2">
// //             <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500
// //                             flex items-center justify-center text-white text-xs font-bold">
// //               {creator.slice(2, 4).toUpperCase()}
// //             </div>
// //             <span className="text-xs text-gray-500 truncate">
// //               {shortenAddress(creator)}
// //             </span>
// //           </div>
// //         </div>
// //       </div>
// //     </Tilt>
// //   );
// // };

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
      className="relative w-[280px] rounded-3xl overflow-hidden cursor-pointer
                 bg-gray-100/30 backdrop-blur-md border border-gray-300
                 shadow-xl hover:shadow-[0_0_60px_rgba(255,0,255,0.6)]
                 transition-all duration-500 hover:-translate-y-2"
    >
      {/* Rainbow Glow Overlay - constantly animated */}
      <div className="absolute inset-0 rounded-3xl blur-xl pointer-events-none rainbow-gradient"></div>

      {/* NFT Image */}
      <div className="relative w-full h-[280px] overflow-hidden rounded-t-3xl">
        <Image
          src={image}
          alt={name}
          width={280}
          height={280}
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
