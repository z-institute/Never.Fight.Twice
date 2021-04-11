const fs = require('fs');
require("@nomiclabs/hardhat-web3") // web3
require('dotenv').config()


let neverFightTwice, neverFightTwiceWeb3, vrfCoordinatorMock, nftSimple, seed, link, keyhash, accounts, alice
const RANDOM_NUMBER_VRF_WIN = '777' // odd to win
const RANDOM_NUMBER_VRF_LOSE = '778' // to lose

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

  const MockLink = await ethers.getContractFactory("MockLink")
  const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice")
  const NFTSimple = await ethers.getContractFactory("NFTSimple");
  const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock")
  keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
  // fee = '1000000000000000000'
  seed = 123
  link = await MockLink.deploy()
  vrfCoordinatorMock = await VRFCoordinatorMock.deploy(link.address)
  neverFightTwice = await NeverFightTwice.deploy(vrfCoordinatorMock.address, link.address, keyhash)
  nftSimple = await NFTSimple.deploy();
  accounts = await hre.ethers.getSigners();
  alice = accounts[0];
  const contract = JSON.parse(fs.readFileSync('artifacts/contracts/NeverFightTwice.sol/NeverFightTwice.json', 'utf8'));
  neverFightTwiceWeb3 = new web3.eth.Contract(contract.abi, neverFightTwice.address)

  console.log("Alice",alice.address);
  console.log("Link",link.address);
  console.log("N.F.T",neverFightTwice.address);
  console.log("NFTSimple", nftSimple.address);
  console.log("VRF", vrfCoordinatorMock.address);


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles();

  // should send link to the deployed contract
  let amount = '2000000000000000000' // if this is a string it will overflow
  await link.transfer(neverFightTwice.address, amount)
  
  // should mint NFT
  await nftSimple.batchMint(alice.address, 3); // tokenId = 0 to 9

  let owner_0 = await nftSimple.ownerOf(0)
  let owner_1 = await nftSimple.ownerOf(1)
  let owner_9 = await nftSimple.ownerOf(9)
  console.log("NFTs belong to", owner_0, owner_1, owner_9)

}

function saveFrontendFiles() {
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ 
      MockLink: link.address,
      NeverFightTwice: neverFightTwice.address,
      NFTSimple: nftSimple.address,
      VRFCoordinatorMock: vrfCoordinatorMock.address
     }, undefined, 2)
  );

  const MockLinkArt = artifacts.readArtifactSync("MockLink");
  const NeverFightTwiceArt = artifacts.readArtifactSync("NeverFightTwice");
  const NFTSimpleArt = artifacts.readArtifactSync("NFTSimple");
  const VRFCoordinatorMockArt = artifacts.readArtifactSync("VRFCoordinatorMock");
  const ERC721Art = artifacts.readArtifactSync("ERC721");

  fs.writeFileSync(contractsDir + "/MockLink.json",JSON.stringify(MockLinkArt, null, 2));
  fs.writeFileSync(contractsDir + "/NeverFightTwice.json",JSON.stringify(NeverFightTwiceArt, null, 2));
  fs.writeFileSync(contractsDir + "/NFTSimple.json",JSON.stringify(NFTSimpleArt, null, 2));
  fs.writeFileSync(contractsDir + "/VRFCoordinatorMock.json",JSON.stringify(VRFCoordinatorMockArt, null, 2));
  fs.writeFileSync(contractsDir + "/ERC721.json",JSON.stringify(ERC721Art, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
