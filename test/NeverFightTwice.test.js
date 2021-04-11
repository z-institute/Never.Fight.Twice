const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers')
const { expect } = require("chai");
const { assert } = require('console');
const fs = require('fs');
require("@nomiclabs/hardhat-web3") // web3
require('dotenv').config()

let neverFightTwice, neverFightTwiceWeb3, vrfCoordinatorMock, nftSimple, seed, link, keyhash, fee, accounts, alice
const RANDOM_NUMBER_VRF_WIN = '777' // odd to win
const RANDOM_NUMBER_VRF_LOSE = '778' // to lose

async function checkBetEvent(_tokenId){
    let events = await neverFightTwiceWeb3.getPastEvents('Bet')
    expect(events[0].event).to.equal('Bet');
    expect(events[0].returnValues._NFTContract).to.equal(nftSimple.address);
    expect(events[0].returnValues._better).to.equal(alice.address);
    expect(events[0].returnValues._tokenId).to.equal(_tokenId.toString());
    expect(events[0].returnValues._seed).to.equal('55634480375741765769918871703393018226375812944819489753333136066302011506688');

    let requestId = events[0].returnValues.requestId
    // console.log(events[0].returnValues)
    return requestId
}

async function checkWinLoseEvent(isWin, requestId, randomNumber){
    let eventName = isWin? "Win": "Lose"
    let events = await neverFightTwiceWeb3.getPastEvents(eventName)
    // console.log(await neverFightTwiceWeb3.getPastEvents('allEvents'))
    // console.log(await neverFightTwiceWeb3.getPastEvents('Lose'))
    expect(events[0].event).to.equal(eventName);
    expect(events[0].returnValues.requestId).to.equal(requestId);
    expect(events[0].returnValues._better).to.equal(alice.address);
    expect(events[0].returnValues.randomNumber).to.equal(randomNumber);
}

describe('#bet', () => {
    // chainlink vrf setup
    // beforeEach(async () => {
    it('deploy contracts and set variables', async () => {
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

    })

    it('should send link to the deployed contract', async () => {
        let amount = '2000000000000000000' // if this is a string it will overflow
        await link.transfer(neverFightTwice.address, amount)
       
        let balance = await link.balanceOf(neverFightTwice.address)
        expect(balance).to.equal(amount)
        console.log("Amount of LINK tokens in the contract:", ethers.utils.formatEther(balance));
    })


    it('should mint NFT', async () => {
        await nftSimple.mint(alice.address, 0); // tokenId = 0
        await nftSimple.mint(alice.address, 1); // tokenId = 1
        await nftSimple.mint(alice.address, 2); // tokenId = 2
        await nftSimple.mint(alice.address, 3); // tokenId = 3

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        expect(nftNum).to.equal(4)
    })

    it('should batch mint NFT from 10 to 19', async () => {
        await nftSimple.batchMint(alice.address, 10); 

        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        expect(nftNum).to.equal(14)
    })

    it('check balance before bet', async () => {
        let nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("Before Bet: balance Alice",nftNum)
        expect(nftNum).to.equal(14)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("Before Bet: balance N.F.T", nftNum)
        expect(nftNum).to.equal(0)
    })

    it('should send NFT to NeverFightTwice: should lose cause no NFT in the contract', async () => {

        tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 0, 123) // tokenId = 0
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)

        //Test the result of the random number request
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, neverFightTwice.address)
        let randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_LOSE)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_LOSE) // win if the random number is an odd number, BUT!! lose if there is no NFTs in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(1)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(13)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(1)
    })

    it('check all owners', async () => {
        let owner_0 = await nftSimple.ownerOf(0)
        let owner_1 = await nftSimple.ownerOf(1)
        let owner_2 = await nftSimple.ownerOf(2)
        let owner_3 = await nftSimple.ownerOf(3)

        expect(owner_0).to.equal(neverFightTwice.address)
        console.log("owner of NFT O is NeverFightTwice")

        expect(owner_1).to.equal(alice.address)
        console.log("owner of NFT 1 is Alice")

        expect(owner_2).to.equal(alice.address)
        console.log("owner of NFT 2 is Alice")

        expect(owner_3).to.equal(alice.address)
        console.log("owner of NFT 3 is Alice")
    })
        it('should win', async () => {

        // let tx0 = await nftSimple.transferFrom(alice.address, neverFightTwice.address, 0) // tokenId = 0
        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 1, 123) // tokenId = 1
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)

        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_WIN, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_WIN)
        await checkWinLoseEvent(true, requestId, RANDOM_NUMBER_VRF_WIN) // win cause there is NFT in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(0)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(14)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(0)
    })

    it('should lose cause no NFT in the contract', async () => {
        tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 2, 123) // tokenId = 2
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)
        // receipt = await tx2.wait()
        // requestId = receipt.events[2].topics[0] // if the seed is the same then result is the same
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_WIN, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_WIN)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_WIN) 
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(1)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(13)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(1)

    })

    it('check all owners', async () => {
        let owner_0 = await nftSimple.ownerOf(0)
        let owner_1 = await nftSimple.ownerOf(1)
        let owner_2 = await nftSimple.ownerOf(2)
        let owner_3 = await nftSimple.ownerOf(3)

        expect(owner_0).to.equal(alice.address)
        console.log("owner of NFT O is Alice")

        expect(owner_1).to.equal(alice.address)
        console.log("owner of NFT 1 is Alice")

        expect(owner_2).to.equal(neverFightTwice.address)
        console.log("owner of NFT 2 is NeverFightTwice")

        expect(owner_3).to.equal(alice.address)
        console.log("owner of NFT 3 is Alice")
    })

    it('should lose', async () => {
        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 3, 123) // tokenId = 3
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)

        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_LOSE)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_LOSE) 
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(2)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(12)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(2)

        // let owner_0 = await nftSimple.ownerOf(0)
        // let owner_1 = await nftSimple.ownerOf(1)

        // console.log("owner of NFT O",owner_0)
        // expect(owner_0).to.equal(alice.address)

        // console.log("owner of NFT 1",owner_1)
        // expect(owner_1).to.equal(alice.address)
    })

    it('check all owners', async () => {
        let owner_0 = await nftSimple.ownerOf(0)
        let owner_1 = await nftSimple.ownerOf(1)
        let owner_2 = await nftSimple.ownerOf(2)
        let owner_3 = await nftSimple.ownerOf(3)

        expect(owner_0).to.equal(alice.address)
        console.log("owner of NFT O is Alice")

        expect(owner_1).to.equal(alice.address)
        console.log("owner of NFT 1 is Alice")

        expect(owner_2).to.equal(neverFightTwice.address)
        console.log("owner of NFT 2 is NeverFightTwice")

        expect(owner_3).to.equal(neverFightTwice.address)
        console.log("owner of NFT 3 is NeverFightTwice")
    })

    it('should win', async () => {

        // let tx0 = await nftSimple.transferFrom(alice.address, neverFightTwice.address, 0) // tokenId = 0
        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 1, 123) // tokenId = 1
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_WIN, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_WIN)
        await checkWinLoseEvent(true, requestId, RANDOM_NUMBER_VRF_WIN) // win cause there is NFT in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(1)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(13)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(1)
    })

    it('check all owners', async () => {
        let owner_0 = await nftSimple.ownerOf(0)
        let owner_1 = await nftSimple.ownerOf(1)
        let owner_2 = await nftSimple.ownerOf(2)
        let owner_3 = await nftSimple.ownerOf(3)

        expect(owner_0).to.equal(alice.address)
        console.log("owner of NFT O is Alice")

        expect(owner_1).to.equal(alice.address)
        console.log("owner of NFT 1 is Alice")

        expect(owner_2).to.equal(alice.address)
        console.log("owner of NFT 2 is Alice")

        expect(owner_3).to.equal(neverFightTwice.address)
        console.log("owner of NFT 3 is NeverFightTwice")
    })

    it('should lose', async () => {

        // let tx0 = await nftSimple.transferFrom(alice.address, neverFightTwice.address, 0) // tokenId = 0
        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 1, 123) // tokenId = 1
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_LOSE)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_LOSE) // win cause there is NFT in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(2)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(12)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(2)
    })
    it('should lose', async () => {

        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 2, 123) // tokenId = 2
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_LOSE)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_LOSE) // win cause there is NFT in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(3)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(11)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(3)
    })

    
    it('check all owners', async () => {
        let owner_0 = await nftSimple.ownerOf(0)
        let owner_1 = await nftSimple.ownerOf(1)
        let owner_2 = await nftSimple.ownerOf(2)
        let owner_3 = await nftSimple.ownerOf(3)

        expect(owner_0).to.equal(alice.address)
        console.log("owner of NFT O is Alice")

        expect(owner_1).to.equal(neverFightTwice.address)
        console.log("owner of NFT 1 is NeverFightTwice")

        expect(owner_2).to.equal(neverFightTwice.address)
        console.log("owner of NFT 2 is NeverFightTwice")

        expect(owner_3).to.equal(neverFightTwice.address)
        console.log("owner of NFT 3 is NeverFightTwice")
    })

    it('should lose', async () => {

        let tx = await nftSimple._safeTransferFrom(alice.address, neverFightTwice.address, 0, 123) // tokenId = 0
        receipt = await tx.wait()
        requestId = receipt.events[5].data.substring(0,66)
        await vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, neverFightTwice.address)
        randomNumber = await neverFightTwice.requestIdToRandomNumber(requestId)
        expect(randomNumber).to.equal(RANDOM_NUMBER_VRF_LOSE)
        await checkWinLoseEvent(false, requestId, RANDOM_NUMBER_VRF_LOSE) // win cause there is NFT in the contract
        arrLength = await neverFightTwice.NFTsLen()
        expect(arrLength).to.equal(4)

        nftNum = (await nftSimple.balanceOf(alice.address)).toNumber()
        console.log("balance Alice",nftNum)
        expect(nftNum).to.equal(10)

        nftNum = (await nftSimple.balanceOf(neverFightTwice.address)).toNumber()
        console.log("balance N.F.T", nftNum)
        expect(nftNum).to.equal(4)
    })


})