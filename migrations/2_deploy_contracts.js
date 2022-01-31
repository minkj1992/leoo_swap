const Token = artifacts.require('LoveToken');
const LeooSwap = artifacts.require('LeooSwap');
const tokens = n => web3.utils.toWei(n, 'ether');

module.exports = async function(deployer) {
  const totalSupply = tokens('1000000'); // 1 million wei

  await deployer.deploy(Token, totalSupply);
  const token = await Token.deployed();

  await deployer.deploy(LeooSwap, token.address);
  const leooSwap = await LeooSwap.deployed();

  // Transfer all tokens to leooSwap ( 1 billion )
  await token.transfer(leooSwap.address, totalSupply);
};
