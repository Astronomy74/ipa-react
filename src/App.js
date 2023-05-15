import React, { Component } from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import Main from './components/MainComponent';
import './css/admin.css';
import './css/income-msg.css';
import './css/main.css';
import './css/msg.css';
import './css/normalize.css';
import './css/stats.css';
import './css/style.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';

const { store, persistor } = ConfigureStore()

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
