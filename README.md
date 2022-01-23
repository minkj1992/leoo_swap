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

#### js prettier
```console
$ npm i -D eslint prettier prettier-eslint eslint-config-prettier eslint-plugin-prettier

```

#### install dependices
```console
$ git clone https://github.com/dappuniversity/starter_kit eth_swap
$ npm install
$ npm audit fix
$ npm install -g truffle
$ npm install identicon.js --save && npm audit fix --force

$ truffle version
Truffle v5.4.30 (core: 5.4.30)
Solidity v0.5.16 (solc-js)
Node v14.15.1
Web3.js v1.5.3

$ truffle migrate
$ truffle console

truffle(development)> leooSwap = await LeooSwap.deployed()
```


## create Token
> let's create token and transfer token to Leoo-Swap

```console
$ truffle migrate --reset
$ truffle console

> token = await LoveToken.deployed()
> leooSwap = await LeooSwap.deployed()
> balance = await token.balanceOf(leooSwap.address)
> balance.toString()
'1000000000'
```