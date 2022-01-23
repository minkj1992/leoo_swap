const { assert } = require('chai');
require('chai').use(require('chai-as-promised')).should();

const Token = artifacts.require('LoveToken');
const LeooSwap = artifacts.require('LeooSwap');
const INITIAL_LOVE_TOKEN_BALANCE = 1000000;

// Multiply token with wei scale
// Actual value of loveToken is eth/100, but here does not matter, we just need wei format.
const multiplyWEIScale = token => web3.utils.toWei(token, 'ether');
const toWei = eth => web3.utils.toWei(eth, 'ether');
const toLove = eth => eth * 100;

contract('LeooSwap', ([deployer, investor]) => {
  let token, leooSwap;
  const totalSupply = multiplyWEIScale(String(INITIAL_LOVE_TOKEN_BALANCE));

  before(async () => {
    token = await Token.new(totalSupply);
    leooSwap = await LeooSwap.new(token.address);
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

  describe('Buy tokens', async () => {
    let result;
    const boughtEthAmount = 1;

    before(async () => {
      // Purchase tokens before each example
      result = await leooSwap.buyTokens({
        from: investor,
        value: toWei(String(boughtEthAmount))
      });
    });

    it('Allows user to instantly purchase tokens from leooSwap for a fixed price', async () => {
      const boughtLoveToken = multiplyWEIScale(
        String(toLove(boughtEthAmount))
      ).toString();
      const investorBalance = await token.balanceOf(investor);

      assert.equal(investorBalance.toString(), boughtLoveToken);

      // Check leooSwap balance after purchase
      const leooSwapBalance = await token.balanceOf(leooSwap.address);
      assert.equal(
        leooSwapBalance.toString(),
        multiplyWEIScale(
          String(INITIAL_LOVE_TOKEN_BALANCE - toLove(boughtEthAmount))
        )
      );

      // Check TokenPurchased event is emitted.
      const event = result.logs[0].args;
      const { _account, _token, _amount, _rate } = event;

      assert.equal(_account, investor);
      assert.equal(_token.toString(), token.address);
      assert.equal(_amount.toString(), boughtLoveToken);
      assert.equal(_rate.toString(), '100');
    });
  });
});
