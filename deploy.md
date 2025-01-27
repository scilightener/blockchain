# from zero to hero
### network:
- brew install npm
- cd amulet-generator
- npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers dotenv web3
- npx hardhat
- touch files
- npx hardhat run scripts/deploy.js --network localhost
- npx hardhat node

### then server:
- npx http-server (in the index.html folder)

### and metamask:
- install chrome ext
- remove other walletes if have any
- connect to a new custom network:
  - default rpc url: http://localhost:8545
  - chain id: 31337
  - currency symbol: ETH
  - add test account from network terminal

### voila