const Token = artifacts.require("LoveToken");
const EthSwap = artifacts.require("EthSwap");

module.exports = async function(deployer) {
  const totalSupply = 1000000000; // 1 billion = 10억
  await deployer.deploy(Token, totalSupply);
  const token = await Token.deployed();

  await deployer.deploy(EthSwap);
  const ethSwap = await EthSwap.deployed();

  // Transfer all tokens to EthSwap ( 1 billion )
  await token.transfer(ethSwap.address, totalSupply);
};