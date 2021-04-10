import React from "react";

export function Mint({mint,tokenSymbol}){
  return (
    <div>
      <h4>Mint</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();
          const formData = new FormData(event.target);
          const tokenID = formData.get("tokenID");

          if (tokenID) {
            mint(tokenID);
          }
        }}
      >
        <div className="form-group">
          <label>TokenId of {tokenSymbol}</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="tokenID"
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
