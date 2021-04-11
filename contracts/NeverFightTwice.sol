pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NeverFightTwice is VRFConsumerBase, IERC721Receiver {

    bytes32 internal keyHash;
    uint256 internal fee;
    address public VRFCoordinator;
    address public LinkToken;
    uint256 public NFTsLen;

    struct NFT {
        address owner;
        address NFTcontract;
        uint256 tokenId;
    }

    NFT[] public NFTs;

    mapping (bytes32 => NFT) requestIdToNFT;
    mapping (bytes32 => uint256) public requestIdToRandomNumber;

    event Win(address _better, bytes32 requestId, uint256 randomNumber, address NFTcontract_original, uint256 tokenId_original, address NFTcontract_win, uint256 tokenId_win);
    event Lose(address _better, bytes32 requestId, uint256 randomNumber, address NFTcontract_original, uint256 tokenId_original);
    event Bet(bytes32 requestId, address _NFTContract, address _better, uint256 _tokenId, uint256 _seed);

    /**
     * Constructor inherits VRFConsumerBase
     *
     * Network: Rinkeby
     * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
     * LINK token address:                0x01BE23585060835E02B77ef475b0Cc51aA1e0709
     * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
     */
    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyHash) public
    VRFConsumerBase(_VRFCoordinator, _LinkToken) {
        VRFCoordinator = _VRFCoordinator; // the contract address that's going to verify the numbers returned by the oracle is actually random 
        keyHash = _keyHash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    // before this, we need to send LINK tokens to this contract 
    function bet(address _NFTContract, address _better, uint256 _tokenId, uint256 _seed) 
    public returns (bytes32) {
        bytes32 requestId = requestRandomness(keyHash, fee, _seed); // requestRandomness is imported from VRFConsumerBase
        requestIdToNFT[requestId] = NFT(_better, _NFTContract, _tokenId);

        // emit RequestedRandomness(requestId);
        emit Bet(requestId, _NFTContract, _better, _tokenId, _seed);

        return requestId;
    }

    // function setBetSeed(uint256 _seed) public {
    //     betterToSeed[msg.sender] = _seed;
    // }

    // only the requested chainlink oracle can call this function
    function fulfillRandomness (bytes32 requestId, uint256 randomNumber)
    internal override {
        NFT memory nft = requestIdToNFT[requestId];
        requestIdToRandomNumber[requestId] = randomNumber;

        if(randomNumber.mod(2) == 0 || NFTsLen == 0) {
            emit Lose(nft.owner, requestId, randomNumber, nft.NFTcontract, nft.tokenId);

            // bettwe lose all NFTs, save this NFT in our database 
            NFTs.push(
                NFT(
                    address(this), // owner is this contract now
                    nft.NFTcontract,
                    nft.tokenId
                )
            );
            NFTsLen++;
        }
        else {
            // better win another k NFTs
            // use the random number to find an NFT
            // send the NFT to the better 
            ERC721(nft.NFTcontract).transferFrom(address(this), nft.owner, nft.tokenId);

            uint256 winningNFTId = randomNumber.mod(NFTsLen);
            NFT memory winningNFT = NFTs[winningNFTId];
            
            // remove element 
            NFTs[winningNFTId] = NFTs[NFTsLen - 1]; // Move the last element into the place to delete
            delete NFTs[NFTsLen - 1]; // Remove the last element
            NFTsLen--;
            
            ERC721(winningNFT.NFTcontract).transferFrom(address(this), nft.owner, winningNFT.tokenId);

            emit Win(nft.owner, requestId, randomNumber, nft.NFTcontract, nft.tokenId, winningNFT.NFTcontract, winningNFT.tokenId);

        }
    }

    // @param _operator The address which called `safeTransferFrom` function
    // @param _from The address which previously owned the token
    // _operator = _from = _better in this case
    // msg.sender is the nft contract address
    function onERC721Received(address, address _from, uint256 _tokenId, bytes memory _data) public override returns (bytes4) {
        // setBetSeed(uint256(_data));
        bet(msg.sender, _from, _tokenId, sliceUint(_data, 0));
        return this.onERC721Received.selector;
    }  

    function sliceUint(bytes memory bs, uint256 start)
    internal pure
    returns (uint256)
    {
        uint256 x;
        assembly {
            x := mload(add(bs, add(0x20, start)))
        }
        return x;
    }
}