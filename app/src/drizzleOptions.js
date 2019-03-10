import LuckyDrawGame from "./contracts/LuckyDrawGame.json"


const dev = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  }
};

const prod = {
};

const config = process.env.REACT_APP_STAGE === 'production'
  ? prod
  : dev;

export default {
  // Add common config values here
  contracts: [LuckyDrawGame],
  ...config
};