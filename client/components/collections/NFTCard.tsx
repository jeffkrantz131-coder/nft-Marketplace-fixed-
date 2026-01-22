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

  const goTo = () => {
     router.push(`/nft/${id}`);
  }

  return (
    <div
      className="bg-white/80 backdrop-blur-lg h-[600px] w-[350px] flex flex-col rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 
             cursor-pointer border border-gray-200"
      onClick={goTo}
    >
      <div className="w-[350px] h-[350px] overflow-hidden rounded-t-2xl">
        <Image
          unoptimized
          src={image}
          alt="Picture of the author"
          className="flex items-center gap-3 py-3rounded-t-2xl mt-4"
          layout="responsive"
          width={350}
          height={350}
          blurDataURL={DATA_URL_DARK}
          placeholder="blur"
        />
      </div>
      <div className="text-gray-800 h-[250px] w-[350px] p-4 relative flex flex-col justify-between">
        <h4 className="px-1 py-2 text-2xl font-bold truncate">{name}</h4>
        <h4 className="px-1 py-1 text-xl font-semibold text-blue-600">$ {price} eth</h4>
        <div className="flex items-center gap-3 py-3">
          <div className="w-[48px] h-[48px] border-2 border-blue-500 rounded-full overflow-hidden">
            <Image
              unoptimized
              src={`../`}
              alt="avatar"
              className="rounded-t-2xl hover:scale-105 transition-transform duration-500"
              layout="responsive"
              width={40}
              height={40}
            />
          </div>
          <h4 className="text-sm font-medium text-gray-600">{shortenAddress(creator)}</h4>
        </div>
        <i className="absolute bottom-2 right-3 opacity-50">
          <svg
            width="208"
            height="28"
            viewBox="0 0 208 28"
            fill="none"
            className="w-[10rem]"
          >
            <path
              d="M160.84 0.0898438H160.21V27.9598H160.84V0.0898438Z"
              fill="#2C6EEB"
            ></path>
            <path
              d="M173 20.2H175.432V13.08L180.856 20.2H182.952V9H180.52V15.896L175.272 9H173V20.2Z"
              fill="#2C6EEB"
            ></path>
            <path
              d="M187.145 20.2H189.609V15.864H194.953V13.624H189.609V11.24H195.673V9H187.145V20.2Z"
              fill="#2C6EEB"
            ></path>
            <path
              d="M201.757 20.2H204.221V11.272H207.629V9H198.349V11.272H201.757V20.2Z"
              fill="#2C6EEB"
            ></path>
            <path
              d="M12.65 0.0898438L0.580017 7.05984V20.9998L12.65 27.9698L24.72 20.9998V7.05984L12.65 0.0898438ZM23.66 20.3898L12.65 26.7498L1.64002 20.3898V7.67984L12.65 1.31984L23.66 7.67984V20.3898Z"
              fill="white"
            ></path>
            <path
              d="M17.38 6.10986H7.89004L6.79004 10.9499H18.52L17.38 6.10986Z"
              fill="#aaaaaa"
            ></path>
            <path
              d="M9.58003 17.6001V14.3901L6.77003 12.6001L3.59003 14.9601L7.92003 22.5001H9.65003L11.7 20.6001V19.6401L9.58003 17.6001Z"
              fill="#aaaaaa"
            ></path>
            <path
              d="M15.73 11.6797H9.59003L10.62 14.3797L10.31 17.3997H12.65L15.01 17.3897L14.72 14.3797L15.73 11.6797Z"
              fill="#aaaaaa"
            ></path>
            <path
              d="M18.54 12.5801L15.76 14.3901V17.6001L13.64 19.6401V20.6001L15.68 22.4801H17.39L21.71 14.9601L18.54 12.5801Z"
              fill="#aaaaaa"
            ></path>
            <text
              textAnchor="center"
              fontFamily="'Noto Sans Mono'"
              fontSize="24"
              id="svg_6"
              y="20"
              x="34"
              strokeWidth="0"
              stroke="#aaaaaa"
              fill="#aaaaaa"
            >
              poether.com
            </text>
          </svg>
        </i>
      </div>
    </div>
  );
};
// import { FC } from "react";
// import Image from "next/image";
// import Tilt from "react-parallax-tilt";
// import { IItem } from "../../interfaces";
// import { DATA_URL_DARK, shortenAddress } from "../../utils";
// import { ethers } from "ethers";
// import { useRouter } from "next/router";

// export const NFTCard: FC<IItem> = (item) => {
//   const { image, price, name, creator, itemId } = item;
//   const id = ethers.BigNumber.from(itemId).toNumber();
//   const router = useRouter();

//   const goTo = () => router.push(`/nft/${id}`);

//   return (
//     <Tilt
//       tiltMaxAngleX={10}
//       tiltMaxAngleY={10}
//       glareEnable={true}
//       glareMaxOpacity={0.1}
//       scale={1.03}
//       transitionSpeed={400}
//       className="w-[350px]"
//     >
//       <div
//         onClick={goTo}
//         className="bg-white rounded-xl border border-gray-200 shadow-sm
//                    hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
//       >
//         {/* NFT IMAGE */}
//         <div className="w-full aspect-square overflow-hidden">
//           <Image
//             src={image}
//             alt={name}
//             className="object-cover hover:scale-105 transition-transform duration-300"
//             width={350}
//             height={350}
//             unoptimized
//             blurDataURL={DATA_URL_DARK}
//             placeholder="blur"
//           />
//         </div>

//         {/* CARD CONTENT */}
//         <div className="p-4 space-y-2">
//           {/* NFT NAME */}
//           <h4 className="text-lg font-semibold truncate">{name || "Untitled NFT"}</h4>

//           {/* PRICE ROW */}
//           <div className="flex justify-between text-sm text-gray-600">
//             <span>Price</span>
//             <span className="font-semibold text-gray-900">{price} ETH</span>
//           </div>

//           {/* CREATOR */}
//           <div className="flex items-center gap-2 pt-2">
//             <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500
//                             flex items-center justify-center text-white text-xs font-bold">
//               {creator.slice(2, 4).toUpperCase()}
//             </div>
//             <span className="text-xs text-gray-500 truncate">
//               {shortenAddress(creator)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </Tilt>
//   );
// };
