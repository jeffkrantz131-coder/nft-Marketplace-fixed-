import { Contract } from "ethers";

export const loadNFTMetadata = async (tokenId: string, nftContract: Contract) => {
  try {
    let tokenURI = await nftContract.tokenURI(tokenId);

    if (!tokenURI) return null;

    // IPFS fix
    if (tokenURI.startsWith("ipfs://")) {
      tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    const res = await fetch(tokenURI);
    const meta = await res.json();

    return {
      name: meta.name,
      description: meta.description,
      image: meta.image?.startsWith("ipfs://")
        ? meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        : meta.image,
    };
  } catch (err) {
    console.error("Metadata load failed", err);
    return null;
  }
};
