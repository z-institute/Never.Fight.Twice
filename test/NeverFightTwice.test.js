const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const { expect } = require("chai");
require('dotenv').config()

const RANDOM_SEED = 100

describe('#bet', () => {
    // chainlink vrf setup
    let neverFightTwice, vrfCoordinatorMock, nftSimple, seed, link, keyhash, fee, accounts, alice
    // beforeEach(async () => {
    it('deploy contracts and set variables', async () => {
        const MockLink = await ethers.getContractFactory("MockLink")
        const NeverFightTwice = await ethers.getContractFactory("NeverFightTwice")
        const NFTSimple = await ethers.getContractFactory("NFTSimple");
        const ERC721 = await ethers.getContractFactory("ERC721");
        const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock")
        keyhash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
        fee = '1000000000000000000'
        seed = 123
        link = await MockLink.deploy()
        vrfCoordinatorMock = await VRFCoordinatorMock.deploy(link.address)
        neverFightTwice = await NeverFightTwice.deploy(vrfCoordinatorMock.address, link.address, keyhash)
        nftSimple = await NFTSimple.deploy();
        accounts = await hre.ethers.getSigners();
        alice = accounts[0]
    })

    it('should send link to the deployed contract', async () => {
        let amount = '2000000000000000000' // if this is a string it will overflow
        await link.transfer(neverFightTwice.address, amount)
       
        let balance = await link.balanceOf(neverFightTwice.address)
        expect(balance).to.equal(amount)
        // console.log("Amount of LINK tokens in the contract:", ethers.utils.formatEther(balance));
    })


    it('should deploy NFT contract and mint NFT', async () => {
        await nftSimple.mint(alice.address, 0); // tokenId = 0

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        expect(nftNum).to.equal(1)
    })

    it('should send NFT to NeverFightTwice', async () => {
        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 0) // tokenId = 0
        let receipt = await tx.wait()
        console.log(receipt.events)
        await expectEvent(receipt, 'Bet', { _better: alice.address, _NFTContract: nftSimple.address, _tokenId: 0 })

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        expect(nftNum).to.equal(0)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        expect(nftNum).to.equal(1)
    })



})