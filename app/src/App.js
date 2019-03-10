import React, { Component } from 'react';

import { Drizzle } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

import drizzleOptions from "./drizzleOptions";
import GameContainer from "./GameContainer";


import logo from './logo.svg';
import './App.css';

const drizzle = new Drizzle(drizzleOptions, null);

class App extends Component {
  render() {

    return (
      <DrizzleContext.Provider drizzle={drizzle}>
          <GameContainer />
      </DrizzleContext.Provider>
    );
  }
}

export default App;
