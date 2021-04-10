# Never.Fight.Twice
* For the chainlink hackathon

An NFT battlefield that can double your NFT or lose all!
Send an NFT to the pool, and have a chance to win another NFT free or lose your NFT!
Bet 3 win another 3 NFTs or lose all. Challenge accepted?

## How to play?
Send your NFT to the contract with your custom seed!

## How to win?
If the VRF coordinator returns an odd number, and there is at least one NFT in the contract, the player wins. Otherwise, the player loses.


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

```
5. Import the private key of the first account into MetaMask and later connect wallet using this address.
5. Run the frontend
```
cd frontend
npm install
npm start
```

## Notes 
This project is modified from https://github.com/pappas999/chainlink-hardhat-box
