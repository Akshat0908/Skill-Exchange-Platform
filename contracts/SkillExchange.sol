// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillExchange is ReentrancyGuard, Ownable {
    struct Skill {
        uint256 id;
        address provider;
        string title;
        string description;
        uint256 price; // in wei
        bool isAvailable;
    }

    struct User {
        string basename;
        uint256 reputationScore;
        uint256 totalTransactions;
    }

    mapping(uint256 => Skill) public skills;
    mapping(address => User) public users;
    uint256 public nextSkillId;

    event SkillListed(uint256 indexed skillId, address indexed provider, string title, uint256 price);
    event SkillUpdated(uint256 indexed skillId, string title, uint256 price, bool isAvailable);
    event SkillPurchased(uint256 indexed skillId, address indexed buyer, address indexed seller, uint256 price);

    constructor() {
        nextSkillId = 1;
    }

    function listSkill(string memory _title, string memory _description, uint256 _price) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        skills[nextSkillId] = Skill({
            id: nextSkillId,
            provider: msg.sender,
            title: _title,
            description: _description,
            price: _price,
            isAvailable: true
        });

        emit SkillListed(nextSkillId, msg.sender, _title, _price);
        nextSkillId++;
    }

    function updateSkill(uint256 _skillId, string memory _title, string memory _description, uint256 _price, bool _isAvailable) external {
        require(skills[_skillId].provider == msg.sender, "Only the skill provider can update");
        
        Skill storage skill = skills[_skillId];
        skill.title = _title;
        skill.description = _description;
        skill.price = _price;
        skill.isAvailable = _isAvailable;

        emit SkillUpdated(_skillId, _title, _price, _isAvailable);
    }

    function purchaseSkill(uint256 _skillId) external payable nonReentrant {
        Skill storage skill = skills[_skillId];
        require(skill.isAvailable, "Skill is not available");
        require(msg.value >= skill.price, "Insufficient payment");

        skill.isAvailable = false;
        payable(skill.provider).transfer(msg.value);

        emit SkillPurchased(_skillId, msg.sender, skill.provider, msg.value);
    }

    function getSkill(uint256 _skillId) external view returns (Skill memory) {
        return skills[_skillId];
    }

    // TODO: Implement reputation system, barter functionality, and community governance
}