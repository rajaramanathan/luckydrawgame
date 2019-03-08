/*
 * Helps to setup data using the exec command on the truffle console
 *  truffle exec test/dataSetup.js --network development
*/
module.exports = async function(callback) {
    
    console.log('Setting up contract....');
    
    const artifacts = require('./../app/src/contracts/LuckyDrawGame.json'); //caution: relative path
    const contract = require('truffle-contract');
    const LuckyDrawGame = contract(artifacts);
    LuckyDrawGame.setProvider(web3.currentProvider);

    console.log('deploying contract...')
    let instance = await LuckyDrawGame.deployed();
    let accounts = (await web3.eth.getAccounts());
    console.log('contract deployed at', instance.address);
    console.log('accounts', accounts.length);

    console.log('create some games...')
    await instance.start(10,6,30,{from:accounts[1],value:2000000000000000000});
    await instance.start(10,9,30,{from:accounts[2],value:3000000000000000000});
    await instance.start(10,12,30,{from:accounts[3],value:4000000000000000000});
    await instance.start(10,16,30,{from:accounts[4],value:4000000000000000000});
    await instance.start(10,16,30,{from:accounts[5],value:5000000000000000000});
    await instance.start(10,16,30,{from:accounts[6],value:5000000000000000000});
    await instance.start(2,18,30,{from:accounts[7],value:6000000000000000000});
    
    callback();
}




