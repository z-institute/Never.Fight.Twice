// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//LINK Token address set to Kovan address. Can get other values at https://docs.chain.link/docs/link-token-contracts
//VRF Details set for Kovan environment, can get other values at https://docs.chain.link/docs/vrf-contracts#config
const LINK_TOKEN_ADDR="0xa36085F69e2889c224210F603D836748e7dC0088"
const VRF_COORDINATOR="0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
const VRF_FEE="100000000000000000"
const VRF_KEYHASH="0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
const LINK_TOKEN_ABI = [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice");
  const neverFightTwice = await NeverFightTwice.deploy(VRF_COORDINATOR, LINK_TOKEN_ADDR, VRF_KEYHASH);

  await neverFightTwice.deployed();

  console.log("NeverFightTwice deployed to:", neverFightTwice.address);

  // npx hardhat fund-link --contract 
  let contractAddr = neverFightTwice.address
  //Fund with 1 LINK token
  const amount = web3.utils.toHex(1e18)

  //Get signer information
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]

  //Create connection to LINK token contract and initiate the transfer
  const linkTokenContract = new ethers.Contract(LINK_TOKEN_ADDR, LINK_TOKEN_ABI, signer)
  var result = await linkTokenContract.transfer(contractAddr, amount).then(function (transaction) {
    console.log('Contract ', contractAddr, ' funded with 1 LINK. Transaction Hash: ', transaction.hash)
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
