import React from "react";

export function Mint({mint,tokenSymbol}){
  return (
    <div>
      <h4>Mint Some Free NFTs to Bet? 🤯</h4>
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
