// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AmuletGenerator {
    struct Amulet {
        uint256 id;
        uint256 power;
        uint256 magic;
        uint256 rarity; // 1-Common, 2-Rare, 3-Legendary
    }

    address public owner;
    uint256 public nextAmuletId = 1;
    mapping(address => Amulet[]) public userAmulets;
    uint256 public constant AMULET_PRICE = 0.01 ether;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    event AmuletCreated(address indexed owner, uint256 id, uint256 power, uint256 magic, uint256 rarity);

    constructor() {
        owner = msg.sender;
    }

    function buyAmulet() public payable {
        require(msg.value == AMULET_PRICE, "Incorrect Ether amount");

        uint256 power = _generateRandomNumber(100);
        uint256 magic = _generateRandomNumber(100);
        uint256 rarity = _generateRandomNumber(3) + 1;

        Amulet memory newAmulet = Amulet({
            id: nextAmuletId,
            power: power,
            magic: magic,
            rarity: rarity
        });

        userAmulets[msg.sender].push(newAmulet);
        emit AmuletCreated(msg.sender, nextAmuletId, power, magic, rarity);

        nextAmuletId++;
    }

    function getAmuletsByOwner(address _owner) public view returns (Amulet[] memory) {
        return userAmulets[_owner];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function _generateRandomNumber(uint256 max) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nextAmuletId))) % max;
    }
}
