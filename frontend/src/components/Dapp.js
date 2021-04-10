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
import { Mint} from "./Mint"
import { Transfer } from "./Transfer";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { NoTokensMessage } from "./NoTokensMessage";
import { AddNFT } from "./AddNFT";
const HARDHAT_NETWORK_ID = '1337';
const NeverFightTwiceAddr = '0x0cE4C9201471222B26bf6039A0ecfdba02D1C9D4';
const NFTSimpleAddr = '0x193c9bE4D9bb1d5dd7C79606015C2746a4cDa235';
const options = {method: 'GET'};

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const RANDOM_NUMBER_VRF_WIN = '777' // odd to win
const RANDOM_NUMBER_VRF_LOSE = '778' // to lose

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
    if (!this.state.tokenData || !this.state.balance || !this.state.balanceNeverFightTwice || !this.state.tokenIds || !this.state.tokenIdsNeverFightTwice || !this.NFTs) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {/* {this.state.tokenData.name} ({this.state.tokenData.symbol}) */}
              Never Fight Twice!
            </h1>
            <p>
              Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
              <b>
                {this.state.balance.toString()} {this.state.tokenData.symbol}
              </b>
              . The tokenIds are <b>{Array.from(this.state.tokenIds).join(', ')}</b>
            </p>

            <p>
              The NeverFightTwice contract <b>{this.neverFightTwice.address}</b> has{" "}
              <b>
                {this.state.balanceNeverFightTwice.toString()} {this.state.tokenData.symbol}
              </b>
              . The tokenIds are <b>{Array.from(this.state.tokenIdsNeverFightTwice).join(', ')}</b>
            </p>
          </div>
        </div>

        <hr />

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
                NFTs={this.NFTs}
                transferTokens={(nftContractAddr, tokenId, seed) =>
                  this._transferTokens(nftContractAddr, tokenId, seed)
                }
              />

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
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
            {/* {this.state.balance.eq(0) && (
              <NoTokensMessage selectedAddress={this.state.selectedAddress} />
            )} */}

            {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
            {/* {this.state.balance.gt(0) && (
              <Transfer
                transferTokens={(tokenId, seed) =>
                  this._transferTokens(tokenId, seed)
                }
                tokenSymbol={this.state.tokenData.symbol}
              />
            )} */}
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this._stopPollingData();
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.enable();

    // First we check the network is 8545
    // if (!this._checkNetwork()) {
    //   return;
    // }

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
    });

    this._intializeEthers();
    this._getTokenData();
    this._startPollingData();

    // TODO: get all NFTs
    this.NFTs = []
    // let response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${userAddress}&order_direction=desc&offset=0&limit=20`, options);
    let response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${userAddress}&order_direction=desc&offset=0&limit=20`, options);
    let commits = await response.json();
    // console.log(commits.assets)
    let NFTs = []
    commits.assets.forEach(function (item, index) {
      NFTs.push({
        name: item.name,
        nftContractName: item.asset_contract.name,
        nftContractAddr: item.asset_contract.address,
        thumbnail: item.image_thumbnail_url,
        openseaLink: item.permalink,
        tokenId: item.token_id
      })
      // console.log(item.name, item.asset_contract.address, item.asset_contract.name, item.image_thumbnail_url, item.permalink)
    });
    this.NFTs = NFTs;
    console.log(NFTs)

    // fetch()
    // .then(response => console.log(response))
    // .catch(err => console.error(err));

  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    // this.web3 = new Web3(this._provider);

    this.neverFightTwice = new ethers.Contract(NeverFightTwiceAddr,NeverFightTwiceArt.abi,this._provider.getSigner(0));
    this.nftSimple = new ethers.Contract(NFTSimpleAddr,NFTSimpleArt.abi,this._provider.getSigner(0));
  }

  // The next to methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

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

    this.setState({ tokenData: { name, symbol } });
  }

  hashCode (s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
  };

  // TODO: change to update all of your NFT balance
  async _updateBalance() {
    const balance = await this.nftSimple.balanceOf(this.state.selectedAddress);
    const balanceNeverFightTwice = await this.nftSimple.balanceOf(this.neverFightTwice.address);
    let tokenIds = await this.listTokensOfOwner({
      token: this.nftSimple.address, 
      account: this.state.selectedAddress
    })
    let tokenIdsNeverFightTwice = await this.listTokensOfOwner({
      token: this.nftSimple.address, 
      account: this.neverFightTwice.address
    })
    this.setState({ balance: balance,  balanceNeverFightTwice: balanceNeverFightTwice, tokenIds: tokenIds, tokenIdsNeverFightTwice: tokenIdsNeverFightTwice});
    console.log('updated balance')
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

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.      
      // this._provider._addEventListener("Lose", function(){
      //   console.log("lose event found");
      // })

      let nftContract = new ethers.Contract(_nftContractAddr, ERC721Art.abi, this._provider.getSigner(0));
      let tx = await nftContract['safeTransferFrom(address,address,uint256,bytes)'](this.state.selectedAddress.toString(), this.neverFightTwice.address.toString(), _tokenId, [...Buffer.from(_seed)]);
      // let tx = await nftContract.safeTransferFrom(this.state.selectedAddress, this.neverFightTwice.address, parseInt(_tokenId), [...Buffer.from(_seed)])
      console.log("transaction sent")
      this.setState({ txBeingSent: tx.hash });
      let receipt = await tx.wait()
      // let requestId = receipt.events[5].data.substring(0,66)
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // await this.vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, this.neverFightTwice.address)
      // await this.vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_WIN, this.neverFightTwice.address)
      // let randomNumber = await this.neverFightTwice.requestIdToRandomNumber(requestId)
      // let randomNumber = await this.neverFightTwice.getRandomNumberFromRequestId(requestId)
      // console.log(randomNumber.toNumber())

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

  // This method sends an ethereum transaction to mint a NFT.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _mint(_tokenId) {

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.      
      this._provider._addEventListener("Mint", function(){
        console.log("mint  event found");
      })

      let tx = await this.nftSimple.safeMint(this.state.selectedAddress, parseInt(_tokenId))
      console.log("transaction sent")
      this.setState({ txBeingSent: tx.hash });
      let receipt = await tx.wait()
      // let requestId = receipt.events[5].data.substring(0,66)
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // await this.vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_LOSE, this.neverFightTwice.address)
      // await this.vrfCoordinatorMock.callBackWithRandomness(requestId, RANDOM_NUMBER_VRF_WIN, this.neverFightTwice.address)
      // let randomNumber = await this.neverFightTwice.requestIdToRandomNumber(requestId)
      // let randomNumber = await this.neverFightTwice.getRandomNumberFromRequestId(requestId)
      // console.log(randomNumber.toNumber())

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

  // This method checks if Metamask selected network is Localhost:8545 
  // _checkNetwork() {
  //   if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID || window.ethereum.networkVersion === '42') { // kovan
  //     return true;
  //   }
  //   console.log(window.ethereum.networkVersion, HARDHAT_NETWORK_ID)

  //   this.setState({ 
  //     networkError: 'Please connect Metamask to Localhost:8545'
  //   });

  //   return false;
  // }
}
