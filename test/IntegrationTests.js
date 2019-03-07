const LuckyDrawGame = artifacts.require("./LuckyDrawGame");

const isAtLeast = (valueToCheck, valueToBeAtLeast, message="") => {
    let valueToCheckBN = web3.utils.toBN(valueToCheck);
    let valueToBeAtLeastBN = web3.utils.toBN(valueToBeAtLeast);
    assert.isTrue(valueToCheckBN.gte(valueToBeAtLeastBN),message);
}

contract("Game organizer tests", async accounts => {
   
    it("initial balance of contract should be zero", async () => {
      let instance = await LuckyDrawGame.deployed();
      let balance = await web3.eth.getBalance(instance.address);
      assert.equal(balance,0, "initial balance of contract should be zero");
    });

    it("initial game count should be zero",async () => {
        let instance = await LuckyDrawGame.deployed();
        let count = await instance.getGameCount();
        assert.equal(count,0);
    });

    it("initial game length should be zero", async () => {
        let instance = await LuckyDrawGame.deployed();
        let gameIds = await instance.getGameIds();
        assert.equal(gameIds.length,0);
    });

    it("getGameCount info should be available only to organizer", async () => {
        let exceptionRaised;
        let instance = await LuckyDrawGame.deployed();
        try{
            await instance.getGameCount({from: accounts[1]});
        }catch(err){
            exceptionRaised = err.message.includes("Need to be the game organizer");
        }
        if (!exceptionRaised) assert.fail();
    });

    it("getGameIds info should be available only to organizer", async () => {
        let exceptionRaised;
        let instance = await LuckyDrawGame.deployed();
        try{
            await instance.getGameIds({from: accounts[1]});
        }catch(err){
            exceptionRaised = err.message.includes("Need to be the game organizer");
        }
        if (!exceptionRaised) assert.fail();
    });
});

contract("Game owner tests", async accounts => {
    const fiveEther = web3.utils.toWei("5"); //5 ether

    it("start game", async () => {
        let instance = await LuckyDrawGame.deployed();
        await instance.start(10,1,30, {value: fiveEther});
        let startBalance = await web3.eth.getBalance(instance.address);
        assert.equal(startBalance,fiveEther);
    });

    it("only one game per organizer", async () => {
        let instance = await LuckyDrawGame.deployed();
        try{
            await instance.start(10,1,30, {value: fiveEther});
        }catch(err){
            exceptionRaised = err.message.includes("Only one open game per organizer");
        }
        if (!exceptionRaised) assert.fail(); 
    });

    it("end game", async () => {
        let instance = await LuckyDrawGame.deployed();
        await instance.end();
        let endBalance = await web3.eth.getBalance(instance.address);
        assert.equal(endBalance,0);
        isAtLeast(await web3.eth.getBalance(accounts[0]), fiveEther);
    });

});

contract("Game player tests", async accounts => {
    const fiveEther = web3.utils.toWei("5"); //5 ether
    const gamePlayer1 = accounts[1];
    const gamePlayer2 = accounts[2];
    let gameId;

    it("start game", async () => {
        let instance = await LuckyDrawGame.deployed();
        await instance.start(10,16,30, {value: fiveEther});
        gameId = (await instance.getGameIds())[0];
    });

    it("draw - player1", async () => {
        let gamePlayer1StartBalance = await web3.eth.getBalance(gamePlayer1);
        let instance = await LuckyDrawGame.deployed();
        await instance.draw(gameId, 10,{from: gamePlayer1})
        let gamePlayer1EndBalance = await web3.eth.getBalance(gamePlayer1);
        isAtLeast(gamePlayer1EndBalance,gamePlayer1StartBalance); //end balance is more than start due to win
    });

    it("draw - player2", async () => {
        let playerStartBalance = await web3.eth.getBalance(gamePlayer2);
        let instance = await LuckyDrawGame.deployed();
        await instance.draw(gameId, 10,{from: gamePlayer2})
        let playerEndBalance = await web3.eth.getBalance(gamePlayer2);
        isAtLeast(playerEndBalance,playerStartBalance); //end balance is more than start due to win
    });

    it("draw not allowed more than once", async () => {
        let instance = await LuckyDrawGame.deployed();
        try{
            await instance.draw(gameId, 10,{from: gamePlayer1})
        }catch(err){
            exceptionRaised = err.message.includes("Player can play only once");
        }
        if (!exceptionRaised) assert.fail(); 
    });
});

contract("Game life cycle tests", async accounts => {
    const fiveEther = web3.utils.toWei("5"); //5 ether
    const gameDurationInMinutes = 30;
    const gameOrganizer = accounts[0]; //used by default for contract deploy
    const gameOwner = accounts[1];
    const gamePlayer = accounts[2];
    let gameId;
    let expectedGameEndTime;

    it("Owner: start game", async () => {
        let instance = await LuckyDrawGame.deployed();
        let now = new Date();
        expectedGameEndTime = new Date(now.setMinutes(now.getMinutes() + gameDurationInMinutes)); 
        await instance.start(10,16,gameDurationInMinutes, {from: gameOwner, value: fiveEther});
        gameId = (await instance.getGameIds())[0];
    });

    it("gameOrganizer: game info after start", async () => {
        let instance = await LuckyDrawGame.deployed();
        let gameInfo = await instance.getGameInfo(gameId,{from: gameOrganizer});
        assert.isTrue(gameInfo.isOpen);
        isAtLeast(gameInfo.balance,fiveEther);
        //end time should not be more than 1 minute from expected end time.
        let diff =  new Date(gameInfo.endTime.toNumber() * 1000).getTime() - expectedGameEndTime.getTime();
        let diffInMinutes = Math.round(diff / 60000);
        assert.isAtMost(diffInMinutes,1);
    });

    it("player: draw", async () => {
        let instance = await LuckyDrawGame.deployed();
        await instance.draw(gameId, 10,{from: gamePlayer})
    });

    it("gameOrganizer: game info", async () => {
        let instance = await LuckyDrawGame.deployed();
        let gameIds = await instance.getGameIds({from: gameOrganizer});
        assert.equal(gameIds.length,1);
        gameId = gameIds[0];
    });

    it("gameOwner: end game", async () => {
        let instance = await LuckyDrawGame.deployed();
        await instance.end({from: gameOwner});
    });

    it("gameOrganizer: game info after end", async () => {
        let instance = await LuckyDrawGame.deployed();
        let gameInfo = await instance.getGameInfo(gameId,{from: gameOrganizer});
        assert.isFalse(gameInfo.isOpen);
        assert.equal(gameInfo.balance,0);
        assert.equal(gameInfo.endTime,0);
    });
   
    it("gameOrganizer: game info by player after end", async () => {
        let instance = await LuckyDrawGame.deployed();
        let gameInfo = await instance.getPlayerGameInfo(gameId, gamePlayer);
        assert.isFalse(gameInfo.isOpen);
        assert.equal(gameInfo.balance,0);
        assert.equal(gameInfo.endTime,0);
        assert.isTrue(gameInfo.bountyOwn > 0);
    });
});