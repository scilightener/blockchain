// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmuletGenerator {
    struct Amulet {
        uint256 id;
        uint256 power;
        uint256 rarity; // 1-Common, 2-Rare, 3-Legendary
    }

    address public owner;
    uint256 public nextAmuletId = 1;
    mapping(address => Amulet[]) public userAmulets;
    mapping(address => uint256) public userPower;
    uint256 public constant AMULET_PRICE = 0.01 ether;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    event AmuletCreated(address indexed owner, uint256 id, uint256 power, uint256 rarity);

    constructor() {
        owner = msg.sender;
    }

    function buyAmulet() public payable {
        require(msg.value == AMULET_PRICE, "Incorrect Ether amount");

        uint256 power = _generateRandomNumber(100);
        uint256 rarity = _generateRandomNumber(3) + 1;

        Amulet memory newAmulet = Amulet({
            id: nextAmuletId,
            power: power,
            rarity: rarity
        });

        userAmulets[msg.sender].push(newAmulet);
        emit AmuletCreated(msg.sender, nextAmuletId, power, rarity);

        nextAmuletId++;
    }

    function useAmulet(uint256 amuletId) public {
        Amulet[] storage amulets = userAmulets[msg.sender];
        uint256 amuletIndex = 0;
        for (uint256 i = 0; i < amulets.length; i++) {
            if (amulets[i].id == amuletId) {
                amuletIndex = i;
                break;
            }
        }
        userPower[msg.sender] += amulets[amuletIndex].power;
        amulets[amuletIndex] = amulets[amulets.length - 1];
        amulets.pop();
    }

    function upgradeAmulet(uint256 amuletId) public payable {
        require(msg.value > 0, "Must send ether to upgrade");
        uint256 improvementFactor = msg.value / (0.01 ether);
        uint256 powerIncrease = _generateRandomNumber(2 * improvementFactor);

        Amulet[] storage amulets = userAmulets[msg.sender];
        for (uint256 i = 0; i < amulets.length; i++) {
            if (amulets[i].id == amuletId) {
                amulets[i].power += powerIncrease;
                return;
            }
        }
        revert("Amulet not found");
    }

    function getAmuletsByOwner(address _owner) public view returns (Amulet[] memory) {
        return userAmulets[_owner];
    }

    function getUserPower(address _owner) public view returns (uint256) {
        return userPower[_owner];
    }

    function _generateRandomNumber(uint256 max) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nextAmuletId))) % max;
    }
}
