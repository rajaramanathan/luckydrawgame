import React, { Component } from 'react';

class Game extends Component {

    constructor(props) {
        super(props)
        this.state = {
            getGameIdsFnKey: null,
            getGameFnKey: null,
        }; 
    }

    componentDidMount() {
        console.log(this.props.drizzle.contracts);
        this.setState({
            getGameIdsFnCacheKey : this.props.drizzle.contracts.LuckyDrawGame.methods.getGameIds.cacheCall(),
            getGameFnKey : this.props.drizzle.contracts.LuckyDrawGame.methods.getGame.cacheCall('')
        });
    }

    render() {
        const { LuckyDrawGame } = this.props.drizzleState.contracts;
        const storedData = LuckyDrawGame.getGameIds[this.state.getGameIdsFnCacheKey];
        let gameIds = storedData ? storedData.value : [];

        const gameInfo = LuckyDrawGame.getGame[this.state.getGameFnKey(gameIds[0])];
        console.log(gameInfo);

        return <><div>
             <ul>{gameIds.map((gameId,index)  => <li key={index}>{index}---{gameId}</li>)}</ul>
        </div></>;

       
    }
}
  
export default Game;
  