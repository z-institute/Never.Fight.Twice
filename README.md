# Never.Fight.Twice
* For the chainlink hackathon

An NFT battlefield that can double your NFT or lose all!
Send an NFT to the pool, and have a chance to win another NFT free or lose your NFT!
Bet 3 win another 3 NFTs or lose all. Challenge accepted?

## How to play?
Send your NFT to the contract with your custom seed!

## How to win?
If the VRF coordinator returns an odd number, and there is at least one NFT in the contract, the player wins. Otherwise, the player loses.

## Deployed Contracts
### Rinkeby
- NeverFightTwice: [0x0cE4C9201471222B26bf6039A0ecfdba02D1C9D4](https://rinkeby.etherscan.io/address/0x0cE4C9201471222B26bf6039A0ecfdba02D1C9D4#code)
- NFTSimple: [0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235](https://rinkeby.etherscan.io/address/0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235#code)

### Kovan
- NeverFightTwice: [0x2DC272108F86832b59eb46ecfD5c117601d6b58e](https://kovan.etherscan.io/address/0x2DC272108F86832b59eb46ecfD5c117601d6b58e#code)
- NFTSimple: [0xB40698744C409069e3dbC90172dB91EDa0D02ac1](https://kovan.etherscan.io/address/0xB40698744C409069e3dbC90172dB91EDa0D02ac1#code)

## Dev
The contracts are in `/contracts` folder, named `NeverFightTwice.sol` and `NFTSimple.sol`. The scripts are under progress. Check `scripts/sample-script.js` to understand the working flow.

## Installation
```
npm install 
```

## Running the code
1. Duplicate the `.env.example` file and rename it to `.env`
2. Fill in the values in `.env`. You may need to go to https://infura.io/ to register an account and get your rpc url.
1. Compile the contracts
```
npx hardhat compile
```
2. Run the scripts
```
npx hardhat run scripts/sample-script.js
```
3. Deploy the contracts 
```
npx hardhat deploy
```
4. Run the tests
```
npx hardhat test ./test/NeverFightTwice.test.js
```
5. Run Hardhat's testing network (if you reset the local network, remember to reset account in MetaMask > Settings > Advanced > Reset Account! Otherwise you will have nonce problem)
```
npx hardhat node

```
5. Deploy contracts (remember to `npx hardhat compile` if u change the contracts)
```
npx hardhat run scripts/deploy.js --network localhost
// npx hardhat run scripts/deploy_rinkeby.js --network rinkeby
// npx hardhat run scripts/deploy_kovan.js --network kovan

```
5. Import the private key of the first account into MetaMask and later connect wallet using this address.
5. Run the frontend
```
cd frontend
npm install
npm start
```
6. Verify the contracts
```
// NeverFightTwice
npx hardhat verify --network rinkeby 0x0cE4C9201471222B26bf6039A0ecfdba02D1C9D4 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B 0x01be23585060835e02b77ef475b0cc51aa1e0709 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311

// NFTSimple
npx hardhat verify --network rinkeby 0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235 

// npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1" "Constructor argument 2"

```
7. Send LINK to NeverFightTwice contract!

## Notes 
This project is modified from https://github.com/pappas999/chainlink-hardhat-box
