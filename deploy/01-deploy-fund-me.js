const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  //importing required methods and functions from hre(hardhat runtime environment )
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  let args = [ethUsdPriceFeedAddress];
  if (developmentChains.includes(network.name)) {
    //local network so we now use mock contract to get the price of the ethereum in USD.

    const usdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = usdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  console.log("ethUsdPriceFeedAddress", ethUsdPriceFeedAddress);

  const fundMe = await deploy("FundMe", {
    contract: "FundMe",
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ["all", "fundMe"];
