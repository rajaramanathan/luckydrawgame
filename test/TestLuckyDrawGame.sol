pragma solidity >=0.4.9;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LuckyDrawGame.sol";

contract TestLuckyDrawGame {

    //need ether to start game
    uint public initialBalance = 10 ether;

    //use one instance for all the tests.
    LuckyDrawGame luckyDrawGame;

    function beforeAll() public {
        luckyDrawGame = new LuckyDrawGame();
    }

    function testInitialBalanceUsingDeployedContract() public {
        Assert.equal(0, address(luckyDrawGame).balance,"Initial balance should be zero");
    }

    function testStart() public {
        luckyDrawGame.start.value(5 ether).gas(3000000)(10,6,1,30);
        Assert.equal(5 ether, address(luckyDrawGame).balance,"Initial balance is incorrect");
    }

    function testDraw() public payable {
        luckyDrawGame.draw.gas(3000000)();
    }

    function testDrawMoreThanOnce() public {
        (bool status,) = address(luckyDrawGame).call.gas(3000000)(abi.encodePacked("draw()"));
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

