const fs = require('fs');
require("@nomiclabs/hardhat-web3") // web3
require('dotenv').config()


let neverFightTwice, nftSimple, link, accounts, alice

/**
 * Constructor inherits VRFConsumerBase
 * 
 * Network: Rinkeby
 * Chainlink VRF Coordinator address: 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B
 * LINK token address:                0x01be23585060835e02b77ef475b0cc51aa1e0709
 * Key Hash: 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311
 */
const VRF_Coordinator_Addr = '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B'
const Link_Addr = '0x01be23585060835e02b77ef475b0cc51aa1e0709'
const keyhash = '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311'

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice")
  const NFTSimple = await ethers.getContractFactory("NFTSimple");
  neverFightTwice = await NeverFightTwice.deploy(VRF_Coordinator_Addr, Link_Addr, keyhash)
  nftSimple = await NFTSimple.deploy();
  alice = await deployer.getAddress()
  
  console.log("Alice",alice);
  console.log("N.F.T",neverFightTwice.address);
  console.log("NFTSimple", nftSimple.address);
  console.log("VRF", VRF_Coordinator_Addr);

   // should mint NFT
   await nftSimple.batchMint(alice.address, 3); // tokenId = 0 to 9

   let owner_0 = await nftSimple.ownerOf(0)
   let owner_1 = await nftSimple.ownerOf(1)
   let owner_9 = await nftSimple.ownerOf(9)
   console.log("NFTs belong to", owner_0, owner_1, owner_9)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
