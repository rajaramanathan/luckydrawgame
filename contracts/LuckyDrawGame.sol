pragma solidity >=0.4.0 <0.6.0;

/**
 * Author: Raja Ramanathan
 * Lucky draw game. Anyone with account can draw to win weis. 
 * Game organizer need to close the game after it ends to claim the remaining balance. 
*/
contract LuckyDrawGame {

    address private gameOrganizer; //owner of the LuckyDrawGame contract

    struct Game {
        bool isOpen;
        uint bountyRange;  // bounty per draw
        uint bountyWeis; 
        uint endTime; 
        uint balance; 
        mapping (address => uint) bountyOwn; //bounty won by each player
    }

    mapping (address => Game) private games; //map of game owner to game
    
    address[] private gameIds;  //list of games

    constructor() public {
        gameOrganizer = msg.sender;
    }

    modifier isGameOrganizer() {
        require (msg.sender == gameOrganizer,"Need to be the game organizer");
        _;
    }
    
    modifier newGameAllowed() {
        require (!games[msg.sender].isOpen, "Only one open game per organizer.");
        _;
    }
    
    /**
     * A player is allowed to draw only when 
     *  game as not expired  and has balance
     *  player has not drawn before
    */
    modifier isDrawAllowed(address gameId) {
        Game storage game = games[gameId];
        require (game.isOpen, "Game not started.");
        require (game.balance > 0, "Game has no balance left to draw");
        require (now <= game.endTime, "Game has expired.");
        require (game.bountyOwn[msg.sender] == 0 , "Player can play only once.");
        _;
    }
    
    /**
     * CAUTION: PRNG is NOT safe to use for real or large bounties. 
     * Acceptable for demo and very small amounts.
     * 
    */ 
    function pseudoRandomNumberGenerator(uint luckyNumber,uint bountyRange) private view returns(uint) {
        return uint(keccak256(abi.encodePacked(msg.sender,luckyNumber))) % bountyRange;
    }

     /**
     *  bountyRange: Max range of the bounty 0.._bountyRange
     *  bountyWeiUnits: Wei units expressed in exponentials of 10. Eg: 12 for Szabo, 9 for shannon 
     *  durationInMinutes: for game to expire from now
     *
    */
    function start (uint bountyRange, uint bountyWeiUnits, uint durationInMinutes) public newGameAllowed payable returns(address gameId) {
        gameId = msg.sender;
        uint bountyWeis = 1 * 10**bountyWeiUnits;
        require(msg.value > bountyRange * bountyWeis,"Not enough value sent");
        games[gameId] = Game(true,bountyRange,bountyWeis,now + durationInMinutes * 1 minutes, msg.value);
        gameIds.push(gameId);
    }
    
    /**
     * draw: Player should have enough gas to draw and earn bounty.
     * gameId: a game is uniquely identified by the address of the game owner.
    */
    function draw(address gameId,uint luckyNumber) public isDrawAllowed(gameId) payable returns (uint){
        Game storage game = games[gameId];
        uint bounty = pseudoRandomNumberGenerator(luckyNumber, game.bountyRange) * game.bountyWeis;
        game.balance -= (bounty);
        game.bountyOwn[msg.sender] = bounty;
        msg.sender.transfer(bounty);
        return bounty;
    }
    
    /**
     * Game organizer can end the game anytime and get refund of the balance 
    */
    function end() public payable returns (uint gameBalance) {
        Game storage game = games[msg.sender];
        gameBalance = game.balance;
        require (gameBalance > 0, "No balance on game to close.");
        msg.sender.transfer(game.balance);
        game.isOpen = false;
        game.balance = 0;
        game.endTime = 0;
    }

    /*
     * returns list of game ids 
    */
    function getGameIds() external view isGameOrganizer returns(address[] memory){
        return gameIds;
    }

    /*
     * returns number of games 
    */
    function getGameCount() external view isGameOrganizer returns(uint){
        return gameIds.length;
    }

    /*
     * Fetch details of a game. Allowed only for game organizer
    */
    function getGameInfo(address gameId) external view isGameOrganizer returns (bool isOpen,uint balance, uint endTime) {
        Game storage game = games[gameId];
        return (game.isOpen, game.balance, game.endTime);
    }

    /*
     * Fetch details of game along with players win. Allowed only for game organizer
    */
    function getPlayerGameInfo(address gameId,address player) external view isGameOrganizer 
        returns (bool isOpen, uint balance, uint endTime, uint bountyOwn) {
        Game storage game = games[gameId];
        return (game.isOpen, game.balance, game.endTime, game.bountyOwn[player]);
    }
}