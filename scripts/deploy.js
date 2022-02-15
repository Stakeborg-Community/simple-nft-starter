
const { ethers } = require("hardhat");

async function main() {

  const SBCA = await ethers.getContractFactory("StakeborgCommunityAchievements");
  const sbca = await SBCA.deploy(
    "StakeborgCommunityAchievements", 
    "SBCA",
    "https://ipfs.io/ipfs/your-CID/"
    );

  await sbca.deployed();
  console.log("Success! Contract was deployed to: ", sbca.address);

  await sbca.mint(1) // 1 Bootstrapper (rare only 1 pice)
  await sbca.mint(10) // 2 Veteran
  await sbca.mint(100) // 3 Adopter
  await sbca.mint(1000) // 4 Sustainer
  await sbca.mint(4000) //  5 Believer

  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
