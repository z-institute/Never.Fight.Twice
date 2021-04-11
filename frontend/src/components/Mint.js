import React, {useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';

export function Mint({mint,tokenSymbol,tokenContractAddr}){
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <h4>Mint Some Free NFTs to Bet? 🤯</h4>
      <span style={{color: 'gray'}}>Add <a href={'https://rinkeby.etherscan.io/address/'+tokenContractAddr} target='_blank'>NFTS</a>{" to MetaMask via Add Token > Custom Token and paste Token Contract Address. "} <CopyToClipboard text={tokenContractAddr}
          onCopy={() => {
            setCopied(true)
            setTimeout(()=>{
              setCopied(false)
            }, 2000)
          }}>
          <Button size="small" variant="contained" style={{color: 'grey'}}>Copy Address</Button>

        </CopyToClipboard>{" "}
        {copied ? <span style={{color: 'black'}}>Copied!</span> : null}</span>
      
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          const formData = new FormData(event.target);
          const number = formData.get("number");

          if (number) {
            mint(number);
          }
        }}
      >
        <div className="form-group">
          <label>Give the number of {tokenSymbol} to mint</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="number"
            placeholder="1"
            required
            />
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Mint!" />
            </div>
          </form>
    </div>
  );
}
