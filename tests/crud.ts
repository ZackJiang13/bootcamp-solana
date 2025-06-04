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

  it("Update journal entry", async () => {
    const tx = await program.methods.updateJournalEntry("Hello", "World2").rpc();
    console.log("Transaction hash:", tx);
    const [journalEntry] = PublicKey.findProgramAddressSync([Buffer.from("Hello"), program.provider.publicKey.toBuffer()], program.programId);
    console.log("Journal entry address:", journalEntry.toBase58());
    const journalEntryAccount = await program.account.journalEntryState.fetch(journalEntry);
    console.log("Journal entry account:", journalEntryAccount);
    expect(journalEntryAccount.title).to.equal("Hello");
    expect(journalEntryAccount.message).to.equal("World2");
    expect(journalEntryAccount.owner.toBase58()).to.equal(program.provider.publicKey.toBase58());
  });

  it("Delete journal entry", async () => {
    const tx = await program.methods.deleteJournalEntry("Hello").rpc();
    console.log("Transaction hash:", tx);
    const [journalEntry] = PublicKey.findProgramAddressSync([Buffer.from("Hello"), program.provider.publicKey.toBuffer()], program.programId);
    console.log("Journal entry address:", journalEntry.toBase58());
    
    // 验证账户已被删除 - 尝试获取账户应该失败
    try {
      await program.account.journalEntryState.fetch(journalEntry);
      // 如果没有抛出异常，测试失败
      expect.fail("Account should have been deleted");
    } catch (error) {
      // 期望抛出异常，因为账户已被删除
      console.log("Account successfully deleted:", error.message);
      expect(error.message).to.include("Account does not exist");
    }
  });
});