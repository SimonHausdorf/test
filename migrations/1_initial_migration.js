const GRNToken = artifacts.require("GRNToken");
const GRNDisperser = artifacts.require("GRNDisperser");

const { addresses, issuanceAddress, getValuePerAddress } = require("../helper");

module.exports = function (deployer) {
  return deployer
    .deploy(GRNToken, addresses, getValuePerAddress(addresses))
    .then((instance) => {
      return deployer.deploy(GRNDisperser, instance.address, issuanceAddress);
    });
};
