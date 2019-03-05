import LuckyDrawGame from "./contracts/LuckyDrawGame.json"

const options = {
    web3: {
      block: false,
      fallback: {
        type: "ws",
        url: "ws://127.0.0.1:9545",
      },
    },
    contracts: [LuckyDrawGame],
  };
  
export default options;