import React, { Component } from 'react';
import web3 from 'web3';

import { ViewGameRow } from './ViewGameRow';
import { PlayGameRow } from './PlayGameRow';

class Games extends Component {

    constructor(props) {
        super(props)
        this.state = {
            player: null,
            getPlayerAllGameInfoFnCacheKey: null
        }; 
    }

    componentDidMount() {
        const player = this.props.drizzleState.accounts[1];
        this.setState({
            player: player,
            getPlayerAllGameInfoFnCacheKey : this.props.drizzle.contracts.LuckyDrawGame.methods.getPlayerAllGameInfo.cacheCall(player)
        });
    }

    playGame() {
        return (gameId) => {
            let luckyNumber = Math.floor(Math.random() * Math.floor(10));
            const result = this.props.drizzle.contracts.LuckyDrawGame.methods.draw.cacheSend(gameId,luckyNumber, {from: this.state.player});
            console.log('playGame',this.state.player, gameId, luckyNumber,result);
        }
    }

    render() {
        const games = [];
        const { LuckyDrawGame:game } = this.props.drizzleState.contracts;
        const retData = game.getPlayerAllGameInfo[this.state.getPlayerAllGameInfoFnCacheKey];
        let retValue = retData ? retData.value : null;
        if (retValue){
            for (let i = 0; i < retValue.ids.length; i++) {
               games.push({id: retValue.ids[i], 
                endTime: new Date(retValue.endTime[i] * 1000),
                maxBounty: web3.utils.fromWei(retValue.maxBounty[i],"ether"),
                win: web3.utils.fromWei(retValue.bountyWon[i],"ether")
                });
            }
        }
        return <>
        <div>
            <table border='1'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Close time</th>
                        <th>Max bounty (ether) </th>
                        <th>Play/Bounty won (ether)</th>
                    </tr>
                </thead>
                <tbody>
                    {games.filter(game => game.endTime > new Date()).map(game => game.win === "0"
                        ? <PlayGameRow key={game.id} game={game} playGame={this.playGame()} /> 
                        : <ViewGameRow key={game.id} game={game} /> 
                    )}
                </tbody>
            </table>
        </div>
            
        </>
    }
}
  
export default Games;
  