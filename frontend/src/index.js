import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import { store } from "./app/store";
import { Provider } from "react-redux";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <Provider store={store}>
    <Dapp />
  </Provider>,
  document.getElementById("root")
);
