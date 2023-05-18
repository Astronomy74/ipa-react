import React, { Component } from "react";
import { PersistGate } from "redux-persist/integration/react";
import Main from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/ConfigureStore";

// bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";

const { store, persistor } = ConfigureStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div>
            <Main />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
export default App;
