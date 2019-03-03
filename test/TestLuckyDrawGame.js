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
        let gameOwnerBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]));
        assert.isTrue(gameOwnerBalance.gte(web3.utils.toBN(fiveEther)));
    });

});