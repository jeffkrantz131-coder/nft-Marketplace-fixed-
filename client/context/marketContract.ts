import axios from "axios";
import { BigNumber, Contract, ethers } from "ethers";
import { IItem, IMetaData } from "../interfaces";

const defaultItem: IItem = {
  itemId: "",
  price: "",
  tokenId: "0",
  creator: "",
  seller: "",
  owner: "",
  sold: "",
  image: "",
  description: "",
  name: "",
  createAt: "",
};

// Get listing fee
export const getListingFee = async (marketContract: Contract): Promise<string> => {
  const listingFee = await marketContract.getListingFee();
  return listingFee.toString();
};

// Get NFTs by seller
export const getNFTBySeller = async (marketContract: Contract) => {
  return await marketContract.getNFTBySeller();
};

// Get NFTs by owner
export const getNFTByOwner = async (marketContract: Contract) => {
  return await marketContract.getNFTByOwner();
};

// Total items in market
export const getTotalItems = async (marketContract: Contract): Promise<number> => {
  const total = await marketContract.getTotalItems();
  return parseInt(total.toString());
};

// Fetch market items
export const fetchMarketItems = async ({
  marketContract,
  offSet,
  limit,
  solded,
}: {
  marketContract: Contract;
  offSet: number;
  limit: number;
  solded: number;
}) => {
  return await marketContract.fetchMarketItems(offSet, limit, solded);
};

// Get all market items
export const getMarketItems = async ({
  marketContract,
}: {
  marketContract: Contract;
}) => {
  return await marketContract.getMarketItems();
};

// Generate item metadata safely
export const generateItem = async (
  item: IItem,
  nftContract: Contract
): Promise<IItem> => {
  try {
    if (item.tokenId.toString() === "0") return defaultItem;

    const tokenUri = await nftContract.tokenURI(item.tokenId);
    if (!tokenUri || tokenUri === "") {
      console.warn(`Missing tokenURI for tokenId ${item.tokenId}`);
      return defaultItem;
    }

    // Convert IPFS URI to HTTP URL
    const ipfsUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");

    const metaResponse = await axios.get(ipfsUri);
    const { name, description, image }: IMetaData = metaResponse.data;

    // Safety check for image
    const imageUrl = image ? `https://ipfs.io/ipfs/${image.replace("ipfs://", "")}` : "";

    return {
      itemId: item.itemId,
      price: ethers.utils.formatUnits(item.price.toString(), "ether"),
      tokenId: item.tokenId,
      creator: item.creator,
      seller: item.seller,
      owner: item.owner,
      sold: item.sold,
      image: imageUrl,
      description: description || "",
      name: name || "",
      createAt: item.createAt.toString(),
    };
  } catch (err) {
    console.error("Error generating item for tokenId:", item.tokenId, err);
    return defaultItem;
  }
};

// Get multiple items safely
export const getItems = async (nftContract: Contract, data: IItem[]): Promise<IItem[]> => {
  const items: IItem[] = await Promise.all(data.map(async (i) => generateItem(i, nftContract)));
  return items.filter(item => item.tokenId !== "0");
};

// Get sold NFTs
export const getSoldNFT = (items: IItem[]): IItem[] => {
  return items.filter(item => item.sold);
};

// Buy NFT
export const buyNFT = async ({
  marketContract,
  nftContract,
  itemId,
  price,
}: {
  marketContract: Contract;
  nftContract: Contract;
  itemId: string;
  price: BigNumber;
}): Promise<boolean | null> => {
  try {
    const transaction = await marketContract.buyNFT(nftContract.address, itemId, { value: price });
    const tx = await transaction.wait();
    console.log("TX >>> ", tx);
    return true;
  } catch (error) {
    console.log("error tx ", error);
    return null;
  }
};

export const resellMarketItem = async ({
  marketContract,
  nftContract,
  itemId,
  price,
  listingFee,
}: {
  marketContract: Contract;
  nftContract: Contract;
  itemId: string;
  price: string;
  listingFee: string;
}) => {
  const parsedPrice = ethers.utils.parseUnits(price, "ether");

  const tx = await marketContract.resellMarketItem(
    nftContract.address,
    itemId,
    parsedPrice,
    { value: listingFee }
  );

  await tx.wait();
  return true;
};
