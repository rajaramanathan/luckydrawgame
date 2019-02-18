pragma solidity >=0.4.9;

/**
 * Author: Raja Ramanathan
 * Lucky draw game. Anyone with account can draw to win weis. 
 * Game organizer need to close the game after it ends to claim the remaining balance. 
*/
contract LuckyDrawGame {
    address private gameOrganizer;
    uint private bountyRange; 
    uint private bountyWeiUnits; 
    uint private gameSeed;
    uint private gameEndTime; 
    mapping (address => bool) private timesPlayed;

    constructor() public payable {
        gameOrganizer = msg.sender;
    }

    modifier isGameOrganizer() {
        require (msg.sender == gameOrganizer,"Need to be the game organizer");
        _;
    }
    
    /**
     * Game is open when there is a balance and game has not expired.
     * 
    */
    modifier isGameOpen() {
        require (gameEndTime != 0, "Game not started.");
        require (address(this).balance > 0, "Game has no balance left to draw");
        require (now <= gameEndTime, "Game has expired.");
        _;
    }
    
    /**
     * Player allowed to draw only maxTriesPerPlayer times.
     *
    */
    modifier isPlayerAllowed() {
        require (!timesPlayed[msg.sender], "Player reached max tries.");
        _;
    }
    
    /**
     * CAUTION: PRNG is NOT safe to use for real or large bounties. 
     * Acceptable for demo and very small amounts.
     * 
    */ 
    function pseudoRandomNumberGenerator() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(msg.sender,gameSeed))) % bountyRange;
    }

     /**
     *  _bountyRange: Max range of the bounty 0.._bountyRange
     *  _bountyWeiUnits: Wei units expressed in exponentials of 10. Eg: 12 for Szabo, 9 for shannon 
     *  _gameSeed: Seed for determining bounty
     * _durationInMinutes: for game to expire from now
     *
    */
    function start (uint _bountyRange, uint _bountyWeiUnits, uint _gameSeed, uint _durationInMinutes) public isGameOrganizer payable {
        require (gameEndTime == 0, "Game is in progress already.");
        bountyRange = _bountyRange;
        bountyWeiUnits = 1 * 10**_bountyWeiUnits;
        require(address(this).balance + msg.value > bountyRange * bountyWeiUnits,"Not enough value sent");
        gameSeed = _gameSeed;
        gameEndTime =  now + _durationInMinutes * 1 minutes;
    }
    
    /**
     * draw. Player should have enough gas to draw and earn bounty.
    */
    function draw() public isGameOpen isPlayerAllowed  payable returns (uint){
        uint bounty = pseudoRandomNumberGenerator() * bountyWeiUnits;
        msg.sender.transfer(bounty);
        timesPlayed[msg.sender] = true;
        return bounty;
    }
    
    /**
     * Game organizer can end the game anytime and get refund of the balance 
    */
    function end() public payable returns (uint) {
        require (msg.sender == gameOrganizer, "Only game organizer can close.");
        require (address(this).balance > 0, "Game has no balance left to refund");
        gameEndTime = 0;
        msg.sender.transfer(address(this).balance);
    }
}