const HDWalletProvider = require('truffle-hdwallet-provider-klaytn');

module.exports = {
  networks: {
    baobab: {
      provider: () => new HDWalletProvider(process.env.PRI_KEY, process.env.API_ENDPOINT),
      network_id: process.env.NETWORK_ID,
      gas: '8500000',
      gasPrice: null,
    },
  },
  
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.1", // Fetch exact version from solc-bin (default: truffle's version)
      docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
    }
  }
}
