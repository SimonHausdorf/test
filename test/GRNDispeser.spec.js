const { accounts, contract } = require("@openzeppelin/test-environment");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const { BN } = require("@openzeppelin/test-helpers");

const GRNToken = contract.fromArtifact("GRNToken");
const GRNDisperser = contract.fromArtifact("GRNDisperser");

const { addresses, getValuePerAddress } = require("../helper");

const { expect } = chai;

describe("GRNDisperser", function () {
  this.timeout(10000);
  const [first, issuanceAddress, ...otherAccounts] = accounts;

  beforeEach(async function () {
    this.token = await GRNToken.new(
      [first, ...addresses.slice(0, addresses.length - 1)],
      getValuePerAddress(addresses),
      {
        from: first,
      }
    );
    this.disperser = await GRNDisperser.new(
      this.token.address,
      issuanceAddress,
      { from: first }
    );
  });

  it("only issuanceAddress can use disperser", async function () {
    await this.token.approve(this.disperser.address, "1000", { from: first });

    expect(
      this.disperser.disperseToken(
        [otherAccounts[0], otherAccounts[1]],
        ["500", "500"],
        { from: first }
      )
    ).to.eventually.be.rejectedWith(
      "Can only be called by distribution account"
    );

    await this.token.transfer(issuanceAddress, "1000", { from: first });

    await this.token.approve(this.disperser.address, "1000", {
      from: issuanceAddress,
    });

    await this.disperser.disperseToken(
      [otherAccounts[0], otherAccounts[1]],
      ["500", "500"],
      { from: issuanceAddress }
    );

    expect(await this.token.balanceOf(otherAccounts[0])).to.be.bignumber.equal(
      new BN("500")
    );
    expect(await this.token.balanceOf(otherAccounts[1])).to.be.bignumber.equal(
      new BN("500")
    );

    expect(await this.token.balanceOf(issuanceAddress)).to.be.bignumber.equal(
      new BN("0")
    );
  });
});
