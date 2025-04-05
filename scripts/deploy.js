async function main() {
  const ProductSale = await hre.ethers.getContractFactory("ProductSale");
  const contract = await ProductSale.deploy();
  await contract.deployed();
  console.log("Contract address:", await contract.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
