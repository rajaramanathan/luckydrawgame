import React, { Component } from 'react';

import { DrizzleContext } from 'drizzle-react';
import Games from "./Games";

class GameContainer extends Component {

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          if (!initialized) {
            return "Loading...";
          }

          //console.log(drizzle, drizzleState);

          return (
            <Games drizzle={drizzle} drizzleState={drizzleState} />
          );
          
        }}
      </DrizzleContext.Consumer>
      
    );
  }
}

export default GameContainer;
