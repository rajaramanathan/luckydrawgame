var LuckyDrawGame = artifacts.require("./LuckyDrawGame.sol");

module.exports = function(deployer) {
  deployer.deploy(LuckyDrawGame);
};
