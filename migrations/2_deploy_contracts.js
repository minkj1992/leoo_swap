const Token = artifacts.require("LoveToken");
const LeooSwap = artifacts.require("LeooSwap");

module.exports = async function(deployer) {
  const totalSupply = 1000000000; // 1 billion = 10억
  await deployer.deploy(Token, totalSupply);
  const token = await Token.deployed();

  await deployer.deploy(LeooSwap);
  const leooSwap = await LeooSwap.deployed();

  // Transfer all tokens to leooSwap ( 1 billion )
  await token.transfer(leooSwap.address, totalSupply);
};