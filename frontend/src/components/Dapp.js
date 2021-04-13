import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import NeverFightTwiceArt from "../contracts/NeverFightTwice.json";
import NFTSimpleArt from "../contracts/NFTSimple.json";
import ERC721Art from "../contracts/ERC721.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Mint} from "./Mint";
import { Popup } from "./Popup";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { AddNFT } from "./AddNFT";
const HARDHAT_NETWORK_ID = '1337';
const NeverFightTwiceAddr = contractAddress.NeverFightTwice;
const NFTSimpleAddr = contractAddress.NFTSimple;
const options = {method: 'GET', cache: "no-store"};

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!this.state.tokenData || !this.state.balance || !this.state.tokenIds || !this.state.NFTs || !this.state.NFTs_NeverFightTwice) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <Popup
              // _open={true}
              // _title={'🎉 Congratulations! You Win!!! 🎊🥳'}
              // _content={{
              //   requestId: '98765894308076546',
              //   randomNumber: '0987654356789087654',
              //   NFTcontract_original: '0x09876547890',
              //   NFTid_original: '9876543234567890876',
              //   // NFTcontract_win: 'NFTcontract_win',
              //   // NFTid_win: 'NFTid_win'
              // }}
              _open={this.state._popup}
              _title={this.state._title}
              _content={this.state._content}
            />
            <h1>
              {/* {this.state.tokenData.name} ({this.state.tokenData.symbol}) */}
              Never Fight Twice!
            </h1>
            <p> Welcome! This is an NFT battlefield that can double your NFT or lose all!
                Send an NFT to the pool, and have a chance to win another NFT free or lose your NFT!
                Challenge accepted?</p>
            {/* <p>
              Welcome <b>{this.state.selectedAddress}</b>! */}
              
              {/* , you have{" "}
              <b>
                {this.state.balance.toString()} {this.state.tokenData.symbol}
              </b>
              . The tokenIds are <b>{Array.from(this.state.tokenIds).join(', ')}</b> */}
            {/* </p> */}

            <span>
              You have{" "}<b>
                {this.state.NFTs.length.toString()}
              </b>{" "} {this.state.NFTs.length === 20? "or more ": ''} NFTs. The <a href={"https://rinkeby.etherscan.io/address/"+this.neverFightTwice.address}>NeverFightTwice contract</a> has a total of{" "}
              <b>
                {this.state.NFTs_NeverFightTwice.length.toString()}
              </b>{" "}NFTs. All previously lost NFTs are locked here. Bet now to win them all! 
              <span style={{color: 'gray', fontSize: 11.5}}>{" * "}NFTs here are fetched from Opensea, so it may be a bit slow to update the latest balances.</span>
              <br/>
              {this.state.latestBetTx && <div>Your Latest Bet Transaction: <a href={"https://rinkeby.etherscan.io/tx/"+this.state.latestBetTx}>{this.state.latestBetTx}</a></div>}

            </span>
          </div>
        </div>

        <hr />
        <br />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
              <AddNFT
                NFTs={this.state.NFTs}
                transferTokens={(nftContractAddr, tokenId, seed) =>
                  this._transferTokens(nftContractAddr, tokenId, seed)}
                  NFTs_NeverFightTwice={this.state.NFTs_NeverFightTwice}
                  memes={this.state.allMemeImgs}
              />
          </div>
        </div>
        <br />

        <div className="row">
          <div className="col-12">
            {/*
              This component displays a form that the user can use to send a 
              mint
            */}
            {(
              <Mint
                mint={(tokenId) =>
                  this._mint(tokenId)
                }
                tokenSymbol={this.state.tokenData.symbol}
                tokenContractAddr={this.nftSimple.address}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  parseLogs(contract, eventName, logs) {
    // let event = contract.interface.getEvent(eventName)
    let topic = contract.interface.getEventTopic(eventName)

    return logs.filter(log => log.topics[0]===topic && contract.address===log.address)
       .map(log => contract.interface.parseLog(log))
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();

    // First we check the network is Rinkeby
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();

      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  async _initialize(userAddress) {
   
    this.setState({
      selectedAddress: userAddress,
      requestIdUsed: []
    });

    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();

    fetch("https://api.imgflip.com/get_memes")
      .then(response => response.json())
      .then(response => {
    const { memes } = response.data
    this.setState({ allMemeImgs: memes, _popup: false })
    // console.log(memes)
    })

  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    // this.web3 = new Web3(this._provider);

    this.neverFightTwice = new ethers.Contract(NeverFightTwiceAddr,NeverFightTwiceArt.abi,this._provider.getSigner(0));
    this.nftSimple = new ethers.Contract(NFTSimpleAddr,NFTSimpleArt.abi,this._provider.getSigner(0));
  }
  handleChangeRequestIdUsed(index) {
    this.setState(prev => ({
      requestIdUsed: prev.requestIdUsed.map((val, i) => !val && i === index ? true : val)
    }))
}

  openPopup(_title, _content){
    this.setState({_title: _title, _content: _content, _popup: true})
    console.log('open popup')
    // auto close after 1 minute
    setTimeout(() => {
      this.setState({_popup: false})
    }, 60000);
  }
    async checkWinLose(){
        let logs = await this._provider.getLogs({address: this.neverFightTwice.address})
        let winLog = this.parseLogs(this.neverFightTwice, "Win", logs)
        let loseLog = this.parseLogs(this.neverFightTwice, "Lose", logs)
        // console.log(winLog, loseLog)
        
        let response = "You "
        let randomNumber, NFTcontract_win, NFTid_win, NFTcontract_original, NFTid_original, requestId
        // console.log(winLog.length, loseLog.length)
        if(winLog.length !== 0){
          // win
          requestId = winLog[0].args[1]
          let idInt = parseInt(requestId.substring(0,10))
          if(!this.state.requestIdUsed[idInt]){
            let _requestIdUsed = this.state.requestIdUsed
            _requestIdUsed[idInt]=true;
            this.setState({requestIdUsed: _requestIdUsed})
            response += "Win!\n"
            randomNumber = winLog[0].args[2].toString()
            NFTcontract_original = winLog[0].args[3]
            NFTid_original = winLog[0].args[4].toString()
            NFTcontract_win = winLog[0].args[5]
            NFTid_win = winLog[0].args[6].toString()
            console.log('Win', requestId, randomNumber, NFTcontract_original, NFTid_original, NFTcontract_win, NFTid_win)

            
            let _title = '🎉 Congratulations! You Win!!! 🎊🥳'
            let _content = {
              requestId: requestId,
              randomNumber: randomNumber,
              NFTid_original: NFTid_original,
              NFTcontract_original: NFTcontract_original,
              NFTcontract_win: NFTcontract_win,
              NFTid_win: NFTid_win
            }
            this.openPopup(_title, _content)
            // alert(response)

            
              }        

            }
        if(loseLog.length !== 0){
          // lose

          requestId = loseLog[0].args[1]
          let idInt = parseInt(requestId.substring(0,10))
          if(!this.state.requestIdUsed[idInt]){
            let _requestIdUsed = this.state.requestIdUsed
            _requestIdUsed[idInt]=true;
            this.setState({requestIdUsed: _requestIdUsed})
            response += "Lose.\n"
            randomNumber = loseLog[0].args[2].toString()
            NFTcontract_original = loseLog[0].args[3]
            NFTid_original = loseLog[0].args[4].toString()
            console.log('Lose', requestId, randomNumber, NFTcontract_original, NFTid_original)
            let _title = '🥺 Oh No... You Lose... 😭😨'
            let _content = {
              requestId: requestId,
              randomNumber: randomNumber,
              NFTcontract_original: NFTcontract_original,
              NFTid_original: NFTid_original
            }
            this.openPopup(_title, _content)
            // alert(response)
          }
        }

        // let isWin = await this.neverFightTwice.requestIdToWinOrLose(requestId)
        // response += isWin? 'Win!\n': 'Lose!\n'
        // let randomNumber = await this.neverFightTwice.getRandomNumberFromRequestId(requestId)
        // response += 'The random number was '+randomNumber.toNumber().toString()
        // if(isWin){
        //   let winTokenId = await this.neverFightTwice.requestIdToWinTokenId(requestId)
        //   let winNFTcontract = await this.neverFightTwice.requestIdToWinNFTcontract(requestId)
        //   response += `\nThe tokenId you won: ${winTokenId}, NFT contract: ${winNFTcontract}`
        // }
        
        // alert(response);    
    }

  // The next to methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => {
      this._updateBalance()
      this.checkWinLose()
    }, 8000); // check every 8 seconds

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _addNFTAddr(nfts){
    console.log(nfts)
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // See your NFTSimple info
  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const name = await this.nftSimple.name();
    const symbol = await this.nftSimple.symbol();

    this.setState({ tokenData: { name, symbol } })

  }

  hashCode (s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };


  async _updateNFTs(){
    const signer = this._provider.getSigner(0);
    const selectedAddress = this.state.selectedAddress;
    // const neverFightTwiceAddr = this.neverFightTwice.address
    // get all NFTs
    // let response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${this.state.selectedAddress}&order_direction=desc&offset=0&limit=20`, options);
    let response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${this.state.selectedAddress}&order_direction=desc&offset=0&limit=20`, options);
    let commits = await response.json();

    let len = commits.assets? commits.assets.length: 0
    let NFTs = []

    for (let i=0;i<len;i++ ){
      let item = commits.assets[i] 
      const token = new ethers.Contract(item.asset_contract.address, ERC721Art.abi, signer);
      let owner = await token.ownerOf(item.token_id)
      if(owner.toLowerCase() === selectedAddress){
      NFTs.push({
        name: item.name,
        nftContractName: item.asset_contract.name,
        nftContractAddr: item.asset_contract.address,
        thumbnail: item.image_thumbnail_url,
        openseaLink: item.permalink,
        tokenId: item.token_id
      })
    }
      
    }
    if(this.state.NFTs){
        this.state.NFTs.filter(async function (nft) { 
          if(nft.openseaLink==='' && nft.nftContractName==='NFTSimple'){
            // let owner = await token.ownerOf(nft.tokenId)
            // console.log(owner,selectedAddress )
            // const token = new ethers.Contract(nft.nftContractAddr, ERC721Art.abi, signer);
            // if(owner.toLowerCase() == selectedAddress){
                const found = NFTs.some(e => e.tokenId===nft.tokenId);
                if (!found) NFTs.unshift(nft)
            
            // }  
          }
          // if(nft.nftContractAddr === this.state.toRemoveNFT && nft.tokenId === this.state.toRemoveId){
          //   NFTs = this.removeA(NFTs, nft)
          // }
       })
  
      }
    console.log('updated NFTs')
    return NFTs
  }
  async _updateNeverFightTwiceNFTs(){

    ////////////
    let response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${this.neverFightTwice.address}&order_direction=desc&offset=0&limit=20`, options);
    let commits = await response.json();
    let len = commits.assets? commits.assets.length: 0
    let NFTs_NeverFightTwice = []
    for (let i=0;i<len;i++ ){
      let item = commits.assets[i] 
      // const token = new ethers.Contract(item.asset_contract.address, ERC721Art.abi, signer);
      // let owner = await token.ownerOf(item.token_id)
      // if(owner.toLowerCase() == neverFightTwiceAddr){
        NFTs_NeverFightTwice.push({
        name: item.name,
        nftContractName: item.asset_contract.name,
        nftContractAddr: item.asset_contract.address,
        thumbnail: item.image_thumbnail_url,
        openseaLink: item.permalink,
        tokenId: item.token_id
      })
    // }
    }

    console.log('updated NeverFightTwice NFTs')
    return NFTs_NeverFightTwice;
  }

  // change to update all of your NFT balance
  async _updateBalance() {
    const balance = await this.nftSimple.balanceOf(this.state.selectedAddress);
    let tokenIds = await this.listTokensOfOwner({
      token: this.nftSimple.address, 
      account: this.state.selectedAddress
    })
    
    this._updateNFTs().then(NFTs => this.setState({ NFTs: NFTs}))
    this._updateNeverFightTwiceNFTs().then(NFTs_NeverFightTwice => this.setState({NFTs_NeverFightTwice: NFTs_NeverFightTwice}));

    // console.log(NFTs.length, commits.assets.length)
    this.setState({ balance: balance, tokenIds: tokenIds});
    console.log('updated balance')
  }
  removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

  async listTokensOfOwner({ token: tokenAddress, account }) {
    const token = new ethers.Contract(tokenAddress, ERC721Art.abi, this._provider.getSigner(0));
  
    const sentLogs = await token.queryFilter(
      token.filters.Transfer(account, null),
    );
    const receivedLogs = await token.queryFilter(
      token.filters.Transfer(null, account),
    );
  
    const logs = sentLogs.concat(receivedLogs)
      .sort(
        (a, b) =>
          a.blockNumber - b.blockNumber ||
          a.transactionIndex - b.TransactionIndex,
      );
  
    const owned = new Set();
  
    for (const log of logs) {
      const { from, to, tokenId } = log.args;
      
      if (this.addressEqual(to, account)) {
        owned.add(tokenId.toString());
      } else if (this.addressEqual(from, account)) {
        owned.delete(tokenId.toString());
      }
    }
  
    // console.log([...owned].join('\n'));
    return owned
  }

  addressEqual(a, b) {
    return a.toLowerCase() === b.toLowerCase();
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(_nftContractAddr, _tokenId, _seed) {

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      let nftContract = new ethers.Contract(_nftContractAddr, ERC721Art.abi, this._provider.getSigner(0));
      let tx = await nftContract['safeTransferFrom(address,address,uint256,bytes)'](this.state.selectedAddress.toString(), this.neverFightTwice.address.toString(), _tokenId, [...Buffer.from(_seed)]);
      // let tx = await nftContract.safeTransferFrom(this.state.selectedAddress, this.neverFightTwice.address, parseInt(_tokenId), [...Buffer.from(_seed)])
      console.log("transaction sent")
      this.setState({ txBeingSent: tx.hash, toRemoveNFT: _nftContractAddr, toRemoveId: _tokenId, latestBetTx: tx.hash  });
      let receipt = await tx.wait()
      // let requestId = receipt.events[5].data.substring(0,66)
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();

    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method sends an ethereum transaction to mint _number NFTs.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _mint(_number) {

    try {
      this._dismissTransactionError();

      let tx = await this.nftSimple.batchMint(this.state.selectedAddress, parseInt(_number))
      console.log("transaction sent to mint ", _number, " NFTS")
      this.setState({ txBeingSent: tx.hash });
      let receipt = await tx.wait()

      this.setState({ NFTs: this.state.NFTs.concat({
        name: '',
        nftContractName: 'NFTSimple',
        nftContractAddr: this.nftSimple.address,
        thumbnail: '',
        openseaLink: '',
        tokenId: receipt.events[0].args[2]
      })});
      
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      await this._updateBalance();

    } catch (error) {
    
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {

      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Rinkeby
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID || window.ethereum.networkVersion === '4') { 
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Rinkeby or Localhost:8545'
    });

    return false;
  }
}
