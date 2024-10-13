const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const SkillExchange = await ethers.getContractFactory("SkillExchange");
  console.log("Deploying SkillExchange...");
  const skillExchange = await SkillExchange.deploy();
  await skillExchange.waitForDeployment();
  console.log("SkillExchange deployed to:", await skillExchange.getAddress());

  const SkillExchangeGovernance = await ethers.getContractFactory("SkillExchangeGovernance");
  console.log("Deploying SkillExchangeGovernance...");
  
  try {
    const governance = await SkillExchangeGovernance.deploy("SkillExchangeGovernance", "SEG");
    await governance.waitForDeployment();
    console.log("SkillExchangeGovernance deployed to:", await governance.getAddress());
    
    // If you need to set the SkillExchange address in the Governance contract,
    // you might need to call a separate function after deployment
    // For example:
    // await governance.setSkillExchangeAddress(await skillExchange.getAddress());
  } catch (error) {
    console.error("Error deploying SkillExchangeGovernance:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
