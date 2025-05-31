import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BootcampVoting } from "../target/types/bootcamp_voting";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("bootcamp-voting", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.bootcampVoting as Program<BootcampVoting>;

  it("Initialize poll", async () => {
    // Add your test here.
    const tx = await program.methods.initializePool(
      new anchor.BN(1),
      "What is your favorite color?",
      new anchor.BN(0),
      new anchor.BN(1722337200)
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8)], program.programId);
    console.log("Poll address:", pollAddress.toBase58());

    const poll = await program.account.poll.fetch(pollAddress);
    console.log("Poll:", poll);
    expect(poll.pollId.toNumber()).to.equal(1);
    expect(poll.description).to.equal("What is your favorite color?");
    expect(poll.pollStart.toNumber()).to.equal(0);
    expect(poll.pollEnd.toNumber()).to.equal(1722337200);
    expect(poll.candidateAmount.toNumber()).to.equal(0);
  });
});
