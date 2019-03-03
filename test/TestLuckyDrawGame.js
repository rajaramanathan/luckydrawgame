const LuckyDrawGame = artifacts.require("./LuckyDrawGame");

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
            let gameIds = await instance.getGameCount({from: accounts[1]});
        }catch(err){
            exceptionRaised = err.message.includes("Need to be the game organizer");
        }
        if (!exceptionRaised) assert.fail();
    });

    it("getGameIds info should be available only to organizer", async () => {
        let exceptionRaised;
        let instance = await LuckyDrawGame.deployed();
        try{
            let gameIds = await instance.getGameIds({from: accounts[1]});
        }catch(err){
            exceptionRaised = err.message.includes("Need to be the game organizer");
        }
        if (!exceptionRaised) assert.fail();
    });
});