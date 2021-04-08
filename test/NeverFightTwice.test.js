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
        alice = accounts[0];
        console.log("Alice",alice.address);
        console.log("Link",link.address);
        console.log("N.F.T",neverFightTwice.address);
        console.log("NFTSimple", nftSimple.address);
        console.log("VRF", vrfCoordinatorMock.address);

    })

    it('should send link to the deployed contract', async () => {
        let amount = '2000000000000000000' // if this is a string it will overflow
        await link.transfer(neverFightTwice.address, amount)
       
        let balance = await link.balanceOf(neverFightTwice.address)
        expect(balance).to.equal(amount)
        console.log("Amount of LINK tokens in the contract:", ethers.utils.formatEther(balance));
    })


    it('should deploy NFT contract and mint NFT', async () => {
        await nftSimple.mint(alice.address, 0); // tokenId = 0
        await nftSimple.mint(alice.address, 1); // tokenId = 1
        await nftSimple.mint(alice.address, 2); // tokenId = 2
        await nftSimple.mint(alice.address, 3); // tokenId = 3

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        expect(nftNum).to.equal(4)
    })

    it('should send NFT to NeverFightTwice', async () => {
        let tx0 = await nftSimple.transferFrom(alice.address, neverFightTwice.address, 0) // tokenId = 0
        let tx1 = await nftSimple.safeTransferFrom(alice.address, neverFightTwice.address, 1) // tokenId = 1
        let tx2 = await nftSimple.safeTransferFrom(alice.address, neverFightTwice.address, 2) // tokenId = 2
        let tx3 = await nftSimple.safeTransferFrom(alice.address, neverFightTwice.address, 3) // tokenId = 3

        let receipt0 = await tx0.wait()
        let receipt1 = await tx1.wait()
        let receipt2 = await tx2.wait()
        let receipt3 = await tx3.wait()
        
        console.log(receipt0.events)
        //console.log(receipt1.events)
        //console.log(receipt2.events)
        //console.log(receipt3.events)

        //await expectEvent(receipt, 'Bet', { _NFTContract: nftSimple.address, _better: alice.address, _tokenId: 0 })

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(0)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(4)

        let owner = await nftSimple.ownerOf(0)

        console.log("owner of NFT O",owner)
        expect(owner).to.equal(neverFightTwice.address)
    })



})