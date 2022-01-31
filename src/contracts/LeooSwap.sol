pragma solidity >=0.5.0 <0.8.0;

import "./LoveToken.sol";
import "./IERC20.sol";

contract LeooSwap {
    string public name = "LeooSwap Instant Exchange";
    IERC20 public token;
    uint256 private rate = 100;

    event TokenPurchased(
        address _account,
        address _token,
        uint _amount,
        uint _rate
    );
    
    event TokensSold(
        address _account,
        address _token,
        uint _amount,
        uint _rate
    );

    constructor(IERC20 _token) public {
        token = _token;
    }
    
    // Investor buys tokens with ETH
    function buyTokens() public payable {
        // Calculate the number of tokens to buy (eth * 100)
        // msg.value is ETH
        uint256 tokenAmount = msg.value * rate;

        // Verify LeooSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    // Investor sells tokens and get back ETH
    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        uint etherAmount = _amount / rate;

        // LeooSwap can't withdraw more ETH than they have
        require(address(this).balance >= etherAmount);

        // do
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }

    function getRate() public view returns (uint256 tokenRate) {
        return rate;
    }

}
