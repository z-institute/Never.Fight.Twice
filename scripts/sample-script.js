// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

//LINK Token address set to Kovan address. Can get other values at https://docs.chain.link/docs/link-token-contracts
//VRF Details set for Kovan environment, can get other values at https://docs.chain.link/docs/vrf-contracts#config
const LINK_TOKEN_ADDR="0xa36085F69e2889c224210F603D836748e7dC0088"
const NeverFightTwice_ADDR="0x502c4FcFF7f4Ee5791d27e064D29e5d29D6Ed88C"
const NFTSimple_ADDR="0xA87DE27598B3Ff98d7C66a19eB68d4916f71C9a8"
const VRF_COORDINATOR="0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
const VRF_FEE="100000000000000000"
const VRF_KEYHASH="0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
const LINK_TOKEN_ABI = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}]'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //Get signer information
  const accounts = await hre.ethers.getSigners()
  const alice = accounts[0]

  console.log("Alice's address:", alice.address)

  // We get the contract to deploy
  const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice");
  const neverFightTwice = new ethers.Contract(NeverFightTwice_ADDR, NeverFightTwice.interface, alice);
  
  // const neverFightTwice = await NeverFightTwice.deploy(VRF_COORDINATOR, LINK_TOKEN_ADDR, VRF_KEYHASH);
  // await neverFightTwice.deployed();

  console.log("NeverFightTwice contract deployed at:", neverFightTwice.address);

  // Fund the contract with 1 LINK
  // npx hardhat fund-link --contract 
  // let contractAddr = NeverFightTwice_ADDR
  // const amount = web3.utils.toHex(1e18)
  const linkTokenContract = new ethers.Contract(LINK_TOKEN_ADDR, LINK_TOKEN_ABI, alice)
  // var result = await linkTokenContract.transfer(contractAddr, amount).then(function (transaction) {
  //   console.log('Contract funded with 1 LINK. Transaction Hash: ', transaction.hash)
  // })

  // check the link balance of the contract
  let balance = await linkTokenContract.balanceOf(neverFightTwice.address)
  console.log("Amount of LINK tokens in the contract:", ethers.utils.formatEther(balance));

  // mint an NFT and send to Alice
  const NFTSimple = await ethers.getContractFactory("NFTSimple");
  const nftSimple = new ethers.Contract(NFTSimple_ADDR, NFTSimple.interface, alice);
  
  // const nftSimple = await NFTSimple.deploy();
  // await nftSimple.deployed();
  console.log("NFTSimple contract deployed at:", nftSimple.address);
  
  let nftNumber = //id to mint
  await nftSimple.mint(alice.address, nftNumber)
  console.log("NFT minted, id:", nftNumber);
  //await nftSimple.mint(alice.address, nftNumber);
  console.log("Number of NFT Alice has:", (await nftSimple.balanceOf(alice.address)).toNumber())

  // Alice send the NFT to our contract 
  await nftSimple.transferFrom(alice.address, neverFightTwice.address, nftNumber)

  console.log("Number of NFT Alice has after transfer:", (await nftSimple.balanceOf(alice.address)).toNumber())


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
