const hre = require("hardhat");

async function main() {
    const AmuletGenerator = await hre.ethers.getContractFactory("AmuletGenerator");
    const amuletGenerator = await AmuletGenerator.deploy();

    await amuletGenerator.deployed();
    console.log("AmuletGenerator deployed to:", amuletGenerator.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
