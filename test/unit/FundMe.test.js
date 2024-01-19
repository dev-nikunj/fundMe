const { deployments, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
  let fundMe;
  beforeEach(async () => {
    const deployer = await getNamedAccounts();
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContracts("FundMe", deployer);
  });
  describe("constructor", async () => {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });
});
