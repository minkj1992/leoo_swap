const { assert } = require('chai');

const Token = artifacts.require('LoveToken');
const LeooSwap = artifacts.require('LeooSwap');
const tokens = n => web3.utils.toWei(n, 'ether');

require('chai').use(require('chai-as-promised')).should();

contract('LeooSwap', accounts => {
  let token, leooSwap;
  const totalSupply = tokens('1000000');

  before(async () => {
    token = await Token.new(totalSupply);
    leooSwap = await LeooSwap.new();
    await token.transfer(leooSwap.address, totalSupply);
  });

  describe('Token deployment', async () => {
    it('contract has valid init data', async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      const decimals = await token.decimals();
      const balance = await token.balanceOf(token.address);
      const givenTotalSupply = await token.totalSupply();

      assert.equal(name, 'Love Token');
      assert.equal(symbol, 'LOVE');
      assert.equal(decimals, 18);
      assert.equal(balance.toString(), '0'); // it swapped to leooSwap
      assert.equal(givenTotalSupply.toString(), totalSupply);
    });
  });

  describe('LeooSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await leooSwap.name();

      assert.equal(name, 'LeooSwap Instant Exchange');
    });

    it('contract has tokens', async () => {
      const balance = await token.balanceOf(leooSwap.address);

      assert.equal(balance, totalSupply);
    });
  });
});
