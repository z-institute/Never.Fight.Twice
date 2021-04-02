const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const { expect } = require("chai");
require('dotenv').config()

const RANDOM_SEED = 100

describe('#bet', () => {
    it('should deploy contract', async () => {
        const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice");
        const neverFightTwice = await NeverFightTwice.deploy(process.env.VRFCoordinator, process.env.LinkToken, process.env.keyHash);
    
        await neverFightTwice.deployed();
    })

    it('should send link to the deployed contract', async () => {
        // expect(await greeter.greet()).to.equal("Hello, world!");
        const LinkTokenContract = await ethers.getContractFactory("LinkTokenInterface");
        let linkToken = await LinkTokenContract.at(process.env.LinkToken);
        
    })
})