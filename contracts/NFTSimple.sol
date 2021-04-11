// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTSimple is ERC721 {
    constructor() public ERC721("NFTSimple", "NFTS") {} 
    
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function _safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        safeTransferFrom(from, to, tokenId, data);
    }

    // mint a batch of 10 tokens.
    function batchMint(address to, uint256 number) public{
        bytes32 previousBlockHash = blockhash(block.number-1);
        uint256 startId = uint256(keccak256(abi.encodePacked(previousBlockHash,msg.sender)));
        for (uint256 i=0;i<number;i++){
            safeMint(to,startId+i);
        }
    }
}