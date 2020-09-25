const chai = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");

const { BN } = require("@openzeppelin/test-helpers");

const {
  shouldBehaveLikeERC20Burnable,
} = require("./behaviors/ERC20Burnable.behavior");
const GRNToken = contract.fromArtifact("GRNToken");
const { addresses, getValuePerAddress } = require("../helper");

const totalSupply = "3294166501000000000000000000";

const { expect } = chai;

describe("ERC20Burnable", function () {
  const [deployer, ...otherAccounts] = accounts;

  const initialBalance = new BN("3294166501000000000000000000");

  beforeEach(async function () {
    this.token = await GRNToken.new([deployer], ["3294166501000000000000000000"], {
      from: deployer,
    });
  });

  shouldBehaveLikeERC20Burnable(deployer, initialBalance, otherAccounts);
});

describe("Init parameters", function () {
  const [owner] = accounts;

  beforeEach(async function () {
    this.token = await GRNToken.new(addresses, getValuePerAddress(addresses), {
      from: owner,
    });
  });

  it("total supply should be correct", async function () {
    expect((await this.token.totalSupply()).toString()).eq(totalSupply);
  });

  it("per address balance should be correct", async function () {
    await Promise.all(
      addresses.map(async (address, i) => {
        if (i === 0) {
          expect(await this.token.balanceOf(address)).to.be.bignumber.equal(
            new BN("99823237000000000000000000")
          );
        } else {
          expect(await this.token.balanceOf(address)).to.be.bignumber.equal(
            new BN("99823227000000000000000000")
          );
        }
      })
    );
  });
});
