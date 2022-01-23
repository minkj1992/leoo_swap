pragma solidity >=0.5.0 <0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);

    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
}