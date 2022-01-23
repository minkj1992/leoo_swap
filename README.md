# Cryptocurrency
> [refs](https://youtube.com/playlist?list=PLS5SEs8ZftgXHEtZ19lXmDQZm_1JKaBTK)


[eip-20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)

## setup
- [Node.js](https://nodejs.org/en/)
- [Ganache](https://www.trufflesuite.com/ganache)
- [Truffle](https://www.trufflesuite.com/)
- [Metamask](https://metamask.io/)
- [starter kit](https://github.com/dappuniversity/starter_kit)
- [identicon.js](https://github.com/stewartlord/identicon.js)

#### install dependices
```bash
$ git clone https://github.com/dappuniversity/starter_kit eth_swap
$ npm install
$ npm audit fix
$ npm install -g truffle
$ npm install identicon.js --save && npm audit fix --force

$ truffle migrate
$ truffle console

truffle(development)> contract = await EthSwap.deployed()
```


## create Token
> let's create token and transfer token to ethSwap

```console
$ truffle migrate --reset
$ truffle console

> token = await LoveToken.deployed()
> ethSwap = await EthSwap.deployed()
> balance = await token.balanceOf(ethSwap.address)
> balance.toString()
'1000000000'
```