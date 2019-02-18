# Lucky draw game
Ethereum DApp - Lucky draw game. 

1. Game organizer can create and start the game with some balance for players to win on draw.
2. Anyone with account on the network can draw to win. The win will be credited to their account. Each player can play only once. 
3. Game organizer can close the game anytime and refund the remaining balance to his account. 

_Caution: The draw is based on PRNG using account# and is meant only for demo using small amounts._

# Developer setup

DApp project is based on truffle framework. 

Pre-requisites: NodeJS v8.9.4 or later 

1. Install truffle. 
	- npm install -g truffle
2. Fork and clone. 
3. Install dependencies. 
	- npm install
4. Compile/test and deploy using truffle
	- truffle compile
	- truffle test
	- truffle migrate 