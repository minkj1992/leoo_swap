/**
 * @title custom erc20 LoveToken.
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/9b3710465583284b8c4c5d2245749246bb2e0094/contracts/token/ERC20/ERC20.sol.
 * and https://github.com/dappuniversity/dapp_token/blob/master/contracts/DappToken.sol
 */

pragma solidity >=0.5.0 <0.8.0;

import "./IERC20.sol";

contract LoveToken is IERC20 {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowed;
    uint256 private _totalSupply;

    string public name = "Love Token";
    string public symbol = "LOVE";
    uint8 public decimals = 18; // same value as wei
    
    constructor(uint256 _initialAmount) public {
        balances[msg.sender] = _initialAmount;
        _totalSupply = _initialAmount;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    // this --(ETH)--> to
    // So _value is standard currency (i.g ETH)
    // (Caution!) this does not mean "LoveToken's Wallet", it can be user or wallet or another wallet.
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balances[msg.sender] >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // from --(loveToken)--> to
    // So _value is this(loveToken) currency
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }
}
