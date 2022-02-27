import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  selectCount,
} from "../features/counter/counterSlice";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  const dispatch = useDispatch();
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage message={networkError} dismiss={dismiss} />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p>Please connect to your wallet.</p>
          <button
            className="btn btn-warning"
            type="button"
            onClick={() => {
              dispatch(increment());
              connectWallet();
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
