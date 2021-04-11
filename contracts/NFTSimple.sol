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
    function batchMint(address to, uint256 tokenId) public{
        uint256 startId = tokenId-(tokenId % 10);
        for (uint256 i=0;i<10;i++){
            safeMint(to,startId+i);
        }
    }
}