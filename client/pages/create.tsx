import Head from "next/head";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { MarketContext } from "../context";
import { NFTStorage, File } from "nft.storage";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { DATA_URL } from "../utils";
import { TransactionProgress } from "../components/common";
import { UploadIcon } from "@heroicons/react/solid";
import axios from "axios";

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_VERCEL_NFT_STORAGE_TOKEN!,
});
interface NFTForm {
  price: string;
  name: string;
  description: string;
}

const WalletConnect = () => {
  return (
    <div>
      <h2>Please Connect your wallet</h2>
    </div>
  );
};

const Create = () => {
  const { isConnected, nftContract, marketContract, getListingFee } =
    useContext(MarketContext);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [form, setForm] = useState<NFTForm>({
    price: "",
    name: "",
    description: "",
  });
  const [listingFee, setListingFee] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);  
  const [txWait, setTxWait] = useState(false);

  
  const fileInput = useRef<HTMLInputElement>(null);

  const triggerOnChange = () => {
  if (!fileInput.current) return;
  fileInput.current.click();
};
  const router = useRouter();
  
  // const triggerOnChange = () => {
  //   if(!fileInput.current) return;
  //   fileInput.current.click();
  // }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  if (!e.target.files) return;

  const { name, description } = form;
  if (!name || !description) {
    toast.info("name and description required");
    return;
  }

  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    toast.error("Please select an image");
    return;
  }

  try {
    setUploading(true);

    // 1️⃣ Upload image to Pinata
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key:
            process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
        },
      }
    );

    const imageHash = res.data.IpfsHash;
    const imageUrl = `ipfs://${imageHash}`;

    // 2️⃣ Upload metadata to Pinata
    const metadata = {
      name,
      description,
      image: imageUrl,
    };

    const metaRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
          pinata_secret_api_key:
            process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
        },
      }
    );

    setFileUrl(`ipfs://${metaRes.data.IpfsHash}`);
    setImageUrl(imageUrl);
    setUploading(false);
  } catch (err) {
    console.error("Pinata upload error:", err);
    toast.error("Upload failed");
    setUploading(false);
  }
}


  const createItem = async () => {
    const { name, description, price } = form;
    if (!name || !description || !price || !fileUrl) {
      toast.info("All form entries are required");
      return;
    }

    try {
      createSale();
    } catch (error) {
      console.log(`error Create item `, error);
      toast.error("Create item fail.");
    }
  };

  const createSale = async () => {
    if (!nftContract || !marketContract) return;
    let toastTx = toast.loading("Please wait...", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    try {
      setTxWait(true);
      let transaction = await nftContract.createToken(fileUrl);

      let tx = await transaction.wait();
      toast.update(toastTx, {
        render: "Tx Ok",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      let event = tx.events[0];
      console.log("EVENT", event);
      let value = event.args[2];
      console.log("VALUE", value);

      let tokenId = value.toNumber();
      console.log("TOKEN-ID", tokenId);

      const price = ethers.utils.parseUnits(form.price, "ether");
      toastTx = toast.loading("Please wait...", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      transaction = await marketContract.createMarketItem(
        nftContract.address,
        tokenId,
        price,
        { value: listingFee }
      );

      tx = await transaction.wait();
      toast.update(toastTx, {
        render: "Tx Ok",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      router.push("/dashboard");
    } catch (error) {
      toast.update(toastTx, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setTxWait(false);
    }
  };

  useEffect(() => {
    if (!marketContract) return;
    (async () => {
      const fee = await getListingFee(marketContract);
      setListingFee(fee);
    })();
  }, []);

  return (
    <div className="bg-gradient text-white">
      <Head>
        <title>Create NFt</title>
        <meta name="description" content="NFT Create" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isConnected ? (
        <div className="mx-auto my-6 flex justify-center items-center">
          <div className="w-[70%]">
            <div className="grid grid-cols-[1fr_300px] gap-24 items-center justify-center">
              <div className="flex flex-col pb-12 text-black">
                <h2 className="text-white text-3xl text-center">Create NFT</h2>
                <input
                  placeholder="Asset Name"
                  className="mt-8 border rounded p-4 focus:outline-none"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                  placeholder="Asset description"
                  className="mt-2 border rounded p-4 focus:outline-none"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <input
                  placeholder="Asset Price in Eth"
                  className="mt-8 border rounded p-4 focus:outline-none"
                  type="number"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  type="file"
                  name="Asset"
                  className="hidden focus:outline-none"
                  ref={fileInput}
                  onChange={onChange}
                />
                { (!imageUrl || uploading ) && (
                  <div className="my-4">
                    <button className="prelative z-10 flex items-center gap-2 p-3 rounded-md text-white font-bold
               bg-gradient-to-r from-red-400 via-yellow-400 to-purple-500
               hover:scale-105 transition-transform duration-500 shadow-xl-2 bg-gradient-to-tr from-rose-400 to-rose-600 text-white rounded-md flex flex-row justify-between items-center" onClick={triggerOnChange}>
                      <UploadIcon className="fill-white w-5 h-5"/>
                      <span>Upload Image</span>
                    </button>
                  </div>
                )}
                {!txWait ? (
                  <button
                    onClick={createItem}
                    className="relative z-10 w-full p-4 font-bold rounded-md text-white
               bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400
               hover:scale-105 transition-transform duration-500 shadow-xl mt-6"
                  >
                    Create NFT
                  </button>
                ) : (
                  <TransactionProgress />
                )}

                <h5 className="text-white mt-4">
                  * Listing Price: {ethers.utils.formatEther(listingFee)} eth
                </h5>
              </div>
              {imageUrl ? (
                              <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 rounded-2xl blur-xl animate-rainbow pointer-events-none"></div>
                <Image
                  src={`https://ipfs.io/ipfs/${imageUrl.slice(7)}`}
                  unoptimized
                  alt="NFT Preview"
                  className="rounded-2xl z-10"
                  layout="responsive"
                  width={300}
                  height={300}
                  placeholder={"blur"}
                  blurDataURL={DATA_URL}
                />
              </div>
            ) : (
              <div className="relative w-[300px] h-[300px] rounded-md border-2 border-blue-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 blur-xl animate-rainbow"></div>
                <h4 className="text-2xl z-10 text-white">No Image</h4>
                {uploading && <p className="py-3 text-center z-10">Uploading...</p>}
              </div>
            )}
            </div>
          </div>
        </div>
      ) : (
        <WalletConnect />
      )}
      <style jsx>{`
      @keyframes rainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .animate-rainbow {
        background: linear-gradient(270deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #9900ff);
        background-size: 1400% 1400%;
        animation: rainbow 6s ease infinite;
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

export default Create;
