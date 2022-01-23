pragma solidity >=0.5.0 <0.8.0;

import "./LoveToken.sol";
import "./IERC20.sol";

contract LeooSwap {
    string public name = "LeooSwap Instant Exchange";
    IERC20 public token;
    uint256 public rate = 100;

    event TokenPurchased(
        address _account,
        address _token,
        uint _amount,
        uint _rate
    );

    constructor(IERC20 _token) public {
        token = _token;
    }
    
    function buyTokens() public payable {
        // Calculate the number of tokens to buy (eth * 100)
        uint256 tokenAmount = msg.value * rate;

        // Verify LeooSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);

    }
}
