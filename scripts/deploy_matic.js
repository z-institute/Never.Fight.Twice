const fs = require('fs');
require("@nomiclabs/hardhat-web3") // web3
require('dotenv').config()


let neverFightTwice, nftSimple, link, accounts, alice

/**
 * Constructor inherits VRFConsumerBase
 * 
 * Network: Matic Testnet
 * Chainlink VRF Coordinator address: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
 * LINK token address:                0x326C977E6efc84E512bB9C30f76E30c160eD06FB
 * Key Hash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
 */
const VRF_Coordinator_Addr = '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255'
const Link_Addr = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
const keyhash = '0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4'

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

  // saveFrontendFiles();

}

function saveFrontendFiles() {
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // const MockLinkArt = artifacts.readArtifactSync("MockLink");
  const NeverFightTwiceArt = artifacts.readArtifactSync("NeverFightTwice");
  const NFTSimpleArt = artifacts.readArtifactSync("NFTSimple");
  // const VRFCoordinatorMockArt = artifacts.readArtifactSync("VRFCoordinatorMock");
  // const ERC721Art = artifacts.readArtifactSync("ERC721");

  // fs.writeFileSync(contractsDir + "/MockLink.json",JSON.stringify(MockLinkArt, null, 2));
  fs.writeFileSync(contractsDir + "/NeverFightTwice.json",JSON.stringify(NeverFightTwiceArt, null, 2));
  fs.writeFileSync(contractsDir + "/NFTSimple.json",JSON.stringify(NFTSimpleArt, null, 2));
  // fs.writeFileSync(contractsDir + "/VRFCoordinatorMock.json",JSON.stringify(VRFCoordinatorMockArt, null, 2));
  // fs.writeFileSync(contractsDir + "/ERC721.json",JSON.stringify(ERC721Art, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
