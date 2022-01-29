const { assert } = require('chai');
require('chai').use(require('chai-as-promised')).should();

const Token = artifacts.require('LoveToken');
const LeooSwap = artifacts.require('LeooSwap');
const RATE = 100;
const INITIAL_ETH_BALANCE = 1000000 / RATE;

// Multiply token with wei scale
// Actual value of loveToken is eth/100, but here does not matter, we just need wei format.
const multiplyWEIScale = token => web3.utils.toWei(token, 'ether');
const toWei = eth => web3.utils.toWei(eth, 'ether');
const toLove = eth => eth * RATE;
const toLoveToken = eth => multiplyWEIScale(String(toLove(eth)));

contract('LeooSwap', ([_, investor]) => {
  let token, leooSwap;
  const totalSupply = toLoveToken(String(INITIAL_ETH_BALANCE));

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
      // Buy tokens before each example.
      result = await leooSwap.buyTokens({
        from: investor,
        value: toWei(String(boughtEthAmount))
      });
    });

    it('Allows user to instantly purchase tokens from leooSwap for a fixed price', async () => {
      const boughtLoveToken = toLoveToken(String(boughtEthAmount)).toString();
      const investorBalance = await token.balanceOf(investor);

      assert.equal(investorBalance.toString(), boughtLoveToken);

      // Check leooSwap balance after purchase
      const leooSwapBalance = await token.balanceOf(leooSwap.address);
      assert.equal(
        leooSwapBalance.toString(),
        toLoveToken(String(INITIAL_ETH_BALANCE - boughtEthAmount))
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

  describe('Sell tokens', async () => {
    let result;
    const sellTokenAmount = toLove(1);

    before(async () => {
      await token.approve(
        { from: investor },
        leooSwap.address,
        multiplyWEIScale(String(sellTokenAmount))
      );
      // Investor sells tokens
      result = await token.sellTokens(
        { from: investor },
        multiplyWEIScale(String(sellTokenAmount))
      );
    });

    it('Allows user to instantly sell tokens to leooSwap for a fixed price', async () => {});
  });
});
