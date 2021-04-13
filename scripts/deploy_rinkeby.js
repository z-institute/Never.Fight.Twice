const fs = require('fs');
require("@nomiclabs/hardhat-web3") // web3
require('dotenv').config()
const hre = require("hardhat");
var sleep = require('sleep');


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

  // wait for 30 seconds before verify
  await sleep.sleep(30) 

  // verify contracts
  await hre.run("verify:verify", {
    address: neverFightTwice.address,
    constructorArguments: [
      VRF_Coordinator_Addr,
      Link_Addr,
      keyhash,
    ],
  })
  await hre.run("verify:verify", {
    address: nftSimple.address,
    constructorArguments: [],
  })

  // TODO: send LINK to NeverFightTwice


  // should mint NFT
  await nftSimple.batchMint(alice, 5); // tokenId = 0 to 9

  //  let owner_0 = await nftSimple.ownerOf(0)
  //  let owner_1 = await nftSimple.ownerOf(1)
  //  let owner_2 = await nftSimple.ownerOf(2)
  //  console.log("NFTs belong to", owner_0, owner_1, owner_2)

  saveFrontendFiles();

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
  const ERC721Art = artifacts.readArtifactSync("ERC721");

  // fs.writeFileSync(contractsDir + "/MockLink.json",JSON.stringify(MockLinkArt, null, 2));
  fs.writeFileSync(contractsDir + "/NeverFightTwice.json",JSON.stringify(NeverFightTwiceArt, null, 2));
  fs.writeFileSync(contractsDir + "/NFTSimple.json",JSON.stringify(NFTSimpleArt, null, 2));
  // fs.writeFileSync(contractsDir + "/VRFCoordinatorMock.json",JSON.stringify(VRFCoordinatorMockArt, null, 2));
  fs.writeFileSync(contractsDir + "/ERC721.json",JSON.stringify(ERC721Art, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
