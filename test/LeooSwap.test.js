const { assert } = require('chai');
require('chai')
  .use(require('chai-as-promised'))
  .should();

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
    const sellEthAmount = 1;
    const sellTokenAmount = toLove(sellEthAmount);

    let result,
      beforeLeooSwapTokenBalance,
      beforeLeooSwapEthBalance,
      beforeInvestorTokenBalance,
      beforeInvestorEthBalance;

    before(async () => {
      beforeLeooSwapTokenBalance = await token.balanceOf(leooSwap.address);
      beforeLeooSwapEthBalance = await web3.eth.getBalance(leooSwap.address);
      beforeInvestorTokenBalance = await token.balanceOf(investor);
      beforeInvestorEthBalance = await web3.eth.getBalance(investor);

      await token.approve(
        leooSwap.address,
        String(multiplyWEIScale(sellTokenAmount.toString())),
        {
          from: investor
        }
      );
      // Investor sells tokens
      result = await leooSwap.sellTokens(
        String(multiplyWEIScale(sellTokenAmount.toString())),
        {
          from: investor
        }
      );
    });

    it('Allows user to instantly sell tokens to LeooSwap for a fixed price', async () => {
      // Check investor token balance after purchase
      let investorTokenBalance = await token.balanceOf(investor);

      assert.equal(
        investorTokenBalance.toString(),
        String(
          parseInt(beforeInvestorTokenBalance.toString()) -
            parseInt(multiplyWEIScale(sellTokenAmount.toString()))
        )
      );

      // Check leooSwap balance after purchase
      const leooSwapTokenBalance = await token.balanceOf(leooSwap.address);
      const leooSwapEthBalance = await web3.eth.getBalance(leooSwap.address);

      assert.equal(
        parseInt(leooSwapTokenBalance),
        parseInt(beforeLeooSwapTokenBalance.toString()) +
          parseInt(multiplyWEIScale(sellTokenAmount.toString()))
      );

      assert.equal(
        parseInt(leooSwapEthBalance),
        parseInt(beforeLeooSwapEthBalance.toString()) -
          parseInt(multiplyWEIScale(sellEthAmount.toString()))
      );

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      const { _account, _token, _amount, _rate } = event;
      assert.equal(_account, investor);
      assert.equal(_token, token.address);
      assert.equal(
        _amount.toString(),
        multiplyWEIScale(sellTokenAmount.toString())
      );
      assert.equal(_rate.toString(), RATE);

      // FAILURE: investor can't sell more tokens than they have
      await leooSwap.sellTokens(String(multiplyWEIScale('500')), {
        from: investor
      }).should.be.rejected;
    });
  });
});
