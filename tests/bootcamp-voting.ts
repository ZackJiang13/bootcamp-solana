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


  it("Initialize candidate", async () => {
    // Add Red candidate to poll
    const tx_red = await program.methods.initializeCandidate("Red", new anchor.BN(1)).rpc();
    const [candidateRedAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Red")], program.programId);
    console.log("Candidate address:", candidateRedAddress.toBase58());

    const candidateRed = await program.account.candidate.fetch(candidateRedAddress);
    console.log("Candidate:", candidateRed);

    // Add Blue candidate to poll
    const tx_blue = await program.methods.initializeCandidate("Blue", new anchor.BN(1)).rpc();
    const [candidateBlueAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Blue")], program.programId);
    console.log("Candidate address:", candidateBlueAddress.toBase58());

    const candidateBlue = await program.account.candidate.fetch(candidateBlueAddress);
    console.log("Candidate:", candidateBlue);
  });


  it("Vote", async () => {
    const tx_vote = await program.methods.vote("Red", new anchor.BN(1)).rpc();
    const [candidateRedAddress] = PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Red")], program.programId);
    const candidateRed = await program.account.candidate.fetch(candidateRedAddress);
    console.log("Candidate:", candidateRed);
    expect(candidateRed.candidateVotes.toNumber()).to.equal(1);
  });
});
