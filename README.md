# Never.Fight.Twice
* For the chainlink hackathon

An NFT battlefield that can double your NFT or lose all!
Send an NFT to the pool, and have a chance to win another NFT free or lose your NFT!
Challenge accepted?

## How to play?
Send your NFT to the contract with your custom seed!

## How to win?
If the VRF coordinator returns an odd number, and there is at least one NFT in the contract, the player wins. Otherwise, the player loses.

## Deployed Contracts
### Rinkeby
- NeverFightTwice: [0xd293eF32c95a786A3921c57D8AD676f77915873b](https://rinkeby.etherscan.io/address/0xd293eF32c95a786A3921c57D8AD676f77915873b#code)
- NFTSimple: [0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235](https://rinkeby.etherscan.io/address/0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235#code)

### Kovan
- NeverFightTwice: [0x2DC272108F86832b59eb46ecfD5c117601d6b58e](https://kovan.etherscan.io/address/0x2DC272108F86832b59eb46ecfD5c117601d6b58e#code)
- NFTSimple: [0xB40698744C409069e3dbC90172dB91EDa0D02ac1](https://kovan.etherscan.io/address/0xB40698744C409069e3dbC90172dB91EDa0D02ac1#code)

## Overview
The contracts are in `contracts/` folder, named `NeverFightTwice.sol` and `NFTSimple.sol`. The deploy scripts are in `scripts/`. Check `test/NeverFightTwice.test.js` to understand the working flow. The core frontend code is in `frontend/src/components/Dapp.js`.

## Installation
```
npm install 
```

## Running the code
1. Duplicate the `.env.example` file and rename it to `.env`
2. Fill in the values in `.env`. You may need to go to https://infura.io/ to register an account and get your rpc url.
3. Run the frontend
```
cd frontend
npm install --legacy-peer-deps
npm start
```
4. Go to http://localhost:3000/ and switch to Rinkeby testnet on MetaMask
5. Click on the "Bet" button under your NFTs to bet.
6. Mint new NFTs in the bottom of the webpage to have more NFTs to bet!

## If you wanna run the code on local network or deploy yourself
1. Compile the contracts
```
npx hardhat compile
```
2. Run the tests
```
npx hardhat test ./test/NeverFightTwice.test.js
```
3. Run Hardhat's testing network (if you reset the local network, remember to reset account in MetaMask > Settings > Advanced > Reset Account! Otherwise you will have nonce problem)
```
npx hardhat node
```
4. Deploy contracts (remember to `npx hardhat compile` if u change the contracts)
```
npx hardhat run scripts/deploy.js --network localhost
// npx hardhat run scripts/deploy_rinkeby.js --network rinkeby
// npx hardhat run scripts/deploy_kovan.js --network kovan
```
5. Verify the contracts
```
// NeverFightTwice
npx hardhat verify --network rinkeby 0xd293eF32c95a786A3921c57D8AD676f77915873b 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B 0x01be23585060835e02b77ef475b0cc51aa1e0709 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311

// NFTSimple
npx hardhat verify --network rinkeby 0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235 

// npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2"
```
6. Send LINK to NeverFightTwice contract!!!! [ALWAYS FORGET]
7. Import the private key of the first account into MetaMask and later connect wallet using this address.
8. Run the frontend
```
cd frontend
npm install
npm start
```
9. Go to http://localhost:3000/ and connect your MetaMask wallet.

## Notes 
This project is modified from https://github.com/pappas999/chainlink-hardhat-box

## TODO
- Show Win / Lose result after bet
- Batch Mint NFT
- Should be able to choose how many NFTs to mint
- Integrate IPFS
- Generate random pixel images when mint 
- See how opensea api can speed up to update the NFT balance after mint
- Display which tokenId has been used and which is not 
- Add waiting for the bet result screen & win or lose (Now console.log on Win Lose event)
- Show random 3 of the user's NFTs and random 3 of N.F.T's NFTs. (may use [react paginate](https://www.npmjs.com/package/react-paginate))
- A button to generate a random seed for the user
- Find out why it's slow when entering random seed
- NFT during bet should be stored in somewhere with some animation