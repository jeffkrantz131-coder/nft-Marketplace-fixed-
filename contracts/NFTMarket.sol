//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

error NFTMarket__Price(string message);
error NFTMarket__ListingFee(uint256 requiered, string message);
error NFTMarket__SetListingFee(string message);
error NFTMarket__ItemId(string message);

contract NFTMarket is ReentrancyGuard {
    event marketItemNFT(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        uint256 createAt,
        bool sold
    );

    event AuctionClaimed(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime
    );

    event NewBid(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event AuctionCancelled(uint256 auctionId);
    using Counters for Counters.Counter;
    Counters.Counter private s_itemIds;
    Counters.Counter private s_itemsSold;

    address payable private s_owner;
    uint256 private s_listingFee;

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 createAt;
        bool sold;
    }

    

    mapping(uint256 => AuctionItem) private s_Auctions;
    Counters.Counter private s_auctionIds;


    mapping(uint256 => MarketItem) private s_MarketItems;

    constructor() {
        s_owner = payable(msg.sender);
        s_listingFee = 0.0025 ether;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        if (price <= 0)
            revert NFTMarket__Price({message: "Price must be above zero"});
        if (msg.value != s_listingFee)
            revert NFTMarket__ListingFee({
                requiered: s_listingFee,
                message: "Price must be equal to listing price"
            });

        s_itemIds.increment();
        uint256 itemId = s_itemIds.current();
        uint256 createAt = block.timestamp;

        s_MarketItems[itemId] = MarketItem({
            itemId: itemId,
            nftContract: nftContract,
            tokenId: tokenId,
            creator: payable(msg.sender),
            seller: payable(msg.sender),
            owner: payable(address(0)),
            price: price,
            createAt: createAt,
            sold: false
        });

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit marketItemNFT(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            address(0),
            price,
            createAt,
            false
        );
    }

    function buyNFT(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = s_MarketItems[itemId].price;
        uint256 tokenId = s_MarketItems[itemId].tokenId;
        if (msg.value != price)
            revert NFTMarket__Price({
                message: "Please submit the asking price in order to complete purchase"
            });
        s_MarketItems[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        s_MarketItems[itemId].owner = payable(msg.sender);
        s_MarketItems[itemId].sold = true;
        s_itemsSold.increment();
        payable(s_owner).transfer(s_listingFee);

        emit marketItemNFT(
            itemId,
            nftContract,
            tokenId,
            s_MarketItems[itemId].creator,
            s_MarketItems[itemId].seller,
            msg.sender,
            price,
            s_MarketItems[itemId].createAt,
            true
        );
    }

    function resellMarketItem(
        address nftContract,
        uint256 itemId,
        uint256 newPrice
    ) public payable nonReentrant {
        
        if (newPrice == 0) {
            revert NFTMarket__Price({ message: "Price must be above zero" });
        }

        
        if (msg.value != s_listingFee) {
            revert NFTMarket__ListingFee({
                requiered: s_listingFee,
                message: "Listing fee required"
            });
        }

        MarketItem storage item = s_MarketItems[itemId];

        // 3️⃣ Ownership check
        require(item.owner == msg.sender, "You are not the owner");

        // 4️⃣ Item must be sold before reselling
        require(item.sold == true, "Item is already listed");

        item.sold = false;
        item.price = newPrice;
        item.seller = payable(msg.sender);
        item.owner = payable(address(0));
        item.createAt = block.timestamp;
        
        s_itemsSold.decrement();
        
        IERC721(nftContract).transferFrom(
            msg.sender,
            address(this),
            item.tokenId
        );

        emit marketItemNFT(
            itemId,
            nftContract,
            item.tokenId,
            item.creator,
            msg.sender,
            address(0),
            newPrice,
            block.timestamp,
            false
        );
    }

    


    struct AuctionItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        uint256 startPrice;       // starting price
        uint256 highestBid;       // current highest bid
        address payable highestBidder;
        uint256 startTime;
        uint256 endTime;
        bool active;              // is auction ongoing
        bool claimed;             // has NFT been claimed by winner
    }

    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startPrice,
        uint256 durationInSeconds
    ) public nonReentrant {
        require(startPrice > 0, "Start price must be greater than 0");

        s_auctionIds.increment();
        uint256 auctionId = s_auctionIds.current();
        
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        s_Auctions[auctionId] = AuctionItem({
            itemId: auctionId,
            nftContract: nftContract,
            tokenId: tokenId,
            creator: payable(msg.sender),
            startPrice: startPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            startTime: block.timestamp,
            endTime: block.timestamp + durationInSeconds,
            active: true,
            claimed: false
        });

        emit AuctionCreated(
            auctionId, 
            nftContract, 
            tokenId, 
            msg.sender, 
            startPrice, 
            block.timestamp, 
            block.timestamp + durationInSeconds);
    }

    


    function placeBid(uint256 auctionId) public payable nonReentrant {
        AuctionItem storage auction = s_Auctions[auctionId];
        require(auction.active, "Auction is not active");
        require(block.timestamp < auction.endTime, "Auction ended");
        uint256 minBid = auction.highestBid > 0 ? auction.highestBid + 0.01 ether : auction.startPrice;
        require(msg.value >= minBid, "Bid too low");

        uint256 previousBid = auction.highestBid;
        address payable previousBidder = auction.highestBidder;

        
        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        
        if (previousBidder != address(0)) {
            (bool success, ) = previousBidder.call{ value: previousBid }("");
            require(success, "Refund failed");
    }

        emit NewBid(
            auctionId, 
            msg.sender, 
            msg.value);
    }


    function claimAuction(uint256 auctionId) public nonReentrant {
        AuctionItem storage auction = s_Auctions[auctionId];

        require(block.timestamp >= auction.endTime, "Auction not ended yet");
        require(!auction.claimed, "Already claimed");

        
        auction.claimed = true;
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            
            IERC721(auction.nftContract).transferFrom(
                address(this),
                auction.highestBidder,
                auction.tokenId
            );

          
            (bool success, ) = auction.creator.call{ value: auction.highestBid }("");
            require(success, "Payment to creator failed");
            } else {
            
            IERC721(auction.nftContract).transferFrom(
                address(this),
                auction.creator,
                auction.tokenId
            );
        }

            emit AuctionClaimed(
                auctionId,
                auction.highestBidder,
                auction.highestBid
        );
    }

    function getAllAuctions() public view returns (AuctionItem[] memory) {
        uint256 totalAuctions = s_auctionIds.current();
        AuctionItem[] memory auctions = new AuctionItem[](totalAuctions);

        for (uint256 i = 0; i < totalAuctions; i++) {
            auctions[i] = s_Auctions[i + 1];
        }

        return auctions;
    }

    function getAuction(uint256 auctionId) public view returns (AuctionItem memory) {
        return s_Auctions[auctionId];
    }

    // event AuctionCancelled(uint256 auctionId);

    function cancelAuction(uint256 auctionId) public nonReentrant {
        AuctionItem storage auction = s_Auctions[auctionId];

        // Auction must be active
        require(auction.active, "Auction not active");

        // Cannot cancel after claimed
        require(!auction.claimed, "Auction already claimed");

        // Only creator can cancel
        require(msg.sender == auction.creator, "Only creator can cancel");

        // Cannot cancel after auction ended
        require(block.timestamp < auction.endTime, "Auction already ended");

        // OpenSea rule: cannot cancel if there is a bid
        require(auction.highestBidder == address(0), "Cannot cancel after bid");

        // Mark auction inactive
        auction.active = false;
        auction.claimed = true;

        // Return NFT to creator
        IERC721(auction.nftContract).transferFrom(
            address(this),
            auction.creator,
            auction.tokenId
        );

        emit AuctionCancelled(auctionId);
    }



    function getMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemsCount = s_itemIds.current();
        uint256 unsoldCount = 0;

        // 1️⃣ Count unsold items safely
        for (uint256 i = 1; i <= itemsCount; i++) {
            if (!s_MarketItems[i].sold) {
                unsoldCount++;
            }
        }

        // 2️⃣ Create array with exact size
        MarketItem[] memory items = new MarketItem[](unsoldCount);
        uint256 currentIndex = 0;

        // 3️⃣ Fill array
        for (uint256 i = 1; i <= itemsCount; i++) {
            if (!s_MarketItems[i].sold) {
                items[currentIndex] = s_MarketItems[i];
                currentIndex++;
            }
        }

        return items;
    }


    function getNFTByOwner() public view returns (MarketItem[] memory) {
        uint256 totalItemsCount = s_itemIds.current();
        uint256 itemCount = getItemOwnerCount(totalItemsCount);
        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if (s_MarketItems[i + 1].owner == msg.sender) {
                uint256 currentId = s_MarketItems[i + 1].itemId;
                MarketItem storage currentItem = s_MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function getNFTBySeller() public view returns (MarketItem[] memory) {
        uint256 totalItemsCount = s_itemIds.current();
        uint256 itemCount = getItemSellerCount(totalItemsCount);
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if (s_MarketItems[i + 1].creator == msg.sender) {
                uint256 currentId = s_MarketItems[i + 1].itemId;
                MarketItem storage currentItem = s_MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function getItemOwnerCount(uint256 totalItemsCount)
        private
        view
        returns (uint256)
    {
        uint256 itemCount = 0;
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if (s_MarketItems[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        return itemCount;
    }

    function getItemSellerCount(uint256 totalItemsCount)
        private
        view
        returns (uint256)
    {
        uint256 itemCount = 0;
        for (uint256 i = 0; i < totalItemsCount; i++) {
            if (s_MarketItems[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        return itemCount;
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }

    function getListingFee() public view returns (uint256) {
        return s_listingFee;
    }

    function setListingFee(uint256 _price) public {
        if (msg.sender != s_owner)
            revert NFTMarket__SetListingFee({message: "Premission denied"});
        s_listingFee = _price;
    }

    function getItemById(uint256 _id) public view returns (MarketItem memory) {
        if (_id < 1 || _id > s_itemIds.current())
            revert NFTMarket__ItemId({message: "Premission denied"});
        return s_MarketItems[_id];
    }

    function getTotalItems() public view returns (uint256 total) {
        uint256 itemsCount = s_itemIds.current();
        uint256 unsoldItemsCount = itemsCount - s_itemsSold.current();
        return unsoldItemsCount;
    }

    function fetchMarketItems(
        uint256 offset,
        uint256 limit,
        uint256 sold
    )
        public
        view
        returns (
            MarketItem[] memory,
            uint256 nextOffset,
            uint256 totalSolded
        )
    {
        uint256 itemsCount = s_itemIds.current();
        uint256 unsoldItemsCount = itemsCount - s_itemsSold.current();

        if (limit == 0) {
            limit = 1;
        }

        if (limit > unsoldItemsCount - offset) {
            limit = unsoldItemsCount - offset;
        }

        MarketItem[] memory items = new MarketItem[](limit);

        uint256 currentIndex = 0;
        uint256 index = 0;
        uint256 solded = 0;

        for (uint256 i = 0; i < itemsCount && currentIndex < limit; i++) {
            index = offset + i + sold + 1;
            if (index <= itemsCount) {
                if (!s_MarketItems[index].sold) {
                    uint256 currentItemId = s_MarketItems[index].itemId;
                    MarketItem storage marketItem = s_MarketItems[
                        currentItemId
                    ];
                    items[currentIndex] = marketItem;
                    currentIndex++;
                } else {
                    solded++;
                }
            }
        }

        if ((offset + sold + 1) > itemsCount) {
            solded = sold;
        }

        return (items, offset + limit, solded);
    }

    function fetchMarketItemsByTime(uint256 time, uint256 limit)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemsCount = s_itemIds.current();
        uint256 unsoldItemsCount = itemsCount - s_itemsSold.current();
        uint256 offset = unsoldItemsCount - 2;
        if (limit == 0) {
            limit = 1;
        }

        if (limit > unsoldItemsCount - offset) {
            limit = unsoldItemsCount - offset;
        }

        MarketItem[] memory items = new MarketItem[](limit);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < itemsCount && currentIndex < limit; i++) {
            if (!s_MarketItems[offset + i + 1].sold) {
                uint256 currentItemId = s_MarketItems[offset + i + 1].itemId;
                MarketItem storage marketItem = s_MarketItems[currentItemId];
                if (
                    time == 0 ||
                    (marketItem.createAt <= block.timestamp &&
                        marketItem.createAt >= time)
                ) {
                    items[currentIndex] = marketItem;
                    currentIndex++;
                }
            }
        }
        return items;
    }
}


    
