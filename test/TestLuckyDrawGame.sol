pragma solidity >=0.4.0 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LuckyDrawGame.sol";

contract TestLuckyDrawGame {

    //need ether to start game
    uint public initialBalance = 10 ether;
    address private gameId;
    uint constant gameBounty = 5 ether;

    //use one instance for all the tests.
    LuckyDrawGame luckyDrawGame;

    function beforeAll() public {
        luckyDrawGame = new LuckyDrawGame();
    }

    function testInitialBalanceUsingDeployedContract() public {
        Assert.equal(0, address(luckyDrawGame).balance,"Initial balance should be zero");
    }

    function testStart() public {
        gameId = luckyDrawGame.start.value(gameBounty).gas(3000000)(10,6,30);
        Assert.equal(gameBounty, address(luckyDrawGame).balance,"Initial balance after start is incorrect");
    }

    function testDraw() public payable {
        uint bounty = luckyDrawGame.draw.gas(3000000)(gameId,1);
        Assert.notEqual(0, bounty, "draw was zero");
        Assert.equal(gameBounty - bounty, address(luckyDrawGame).balance, "Balance after draw is incorrect.");
    }

    function testDrawMoreThanOnce() public {
        uint luckyNumber = 1;
        (bool status,) = address(luckyDrawGame).call.gas(3000000)(abi.encodePacked("draw(address,uint)",gameId,luckyNumber));
        Assert.equal(false,status,"Call to second draw failed");
    }

    function testEnd() public payable {
        luckyDrawGame.end.gas(3000000)();
        Assert.equal(0, address(luckyDrawGame).balance,"balance after close should be zero");
    }

    //The game contract sends ether to the calling contract on draw and end
    //so the test contract should be payable to receieve ether
    function () external payable {
    }
}

