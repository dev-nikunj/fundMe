const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  await deployments.fixture(["FundMe"]);
  const fundMeContract = await deployments.get("FundMe");
  const fundMe = await ethers.getContractAt(
    fundMeContract.abi,
    fundMeContract.address
  );
  console.log(`Got contract FundMe at ${fundMe.address}`);
  console.log("Funding contract...");
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await transactionResponse.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
