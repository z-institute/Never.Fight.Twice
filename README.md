# Never.Fight.Twice
* For the chainlink hackathon

An NFT battlefield that can double your NFT or lose all!
Send an NFT to the pool, and have a chance to win another NFT free or lose your NFT!
Bet 3 win another 3 NFTs or lose all. Challenge accepted?

# Dev
The contracts are in `/contracts` folder, named `NeverFightTwice.sol` and `NFTSimple.sol`. The scripts are under progress. Check `scripts/sample-script.js` to understand the working flow.

# Installation
```
npm install 
```

# Running the code
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

# Notes 
This project is modified from https://github.com/pappas999/chainlink-hardhat-box
