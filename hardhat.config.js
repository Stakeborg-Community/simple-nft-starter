require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.2",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [ process.env.PRIVATE_KEY ]
    },
  }
};
