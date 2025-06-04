import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crud } from "../target/types/crud";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("crud", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.crud as Program<Crud>;

  it("Create journal entry", async () => {
    const tx = await program.methods.createJournalEntry("Hello", "World").rpc();
    console.log("Transaction hash:", tx);
    const [journalEntry] = PublicKey.findProgramAddressSync([Buffer.from("Hello"), program.provider.publicKey.toBuffer()], program.programId);
    console.log("Journal entry address:", journalEntry.toBase58());
    const journalEntryAccount = await program.account.journalEntryState.fetch(journalEntry);
    console.log("Journal entry account:", journalEntryAccount);
    expect(journalEntryAccount.title).to.equal("Hello");
    expect(journalEntryAccount.message).to.equal("World");
    expect(journalEntryAccount.owner.toBase58()).to.equal(program.provider.publicKey.toBase58());
  });
  
  
});