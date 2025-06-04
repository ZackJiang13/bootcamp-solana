use anchor_lang::prelude::*;

declare_id!("3jgTRpimcgTARXE5X8JZTguMNE2rdwiZj4miRGgUSFXb");

#[program]
pub mod crud {
    use super::*;

    pub fn create_journal_entry(ctx: Context<CreateJournalEntry>, title: String, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = ctx.accounts.signer.key();
        journal_entry.title = title;
        journal_entry.message = message;
        msg!("Journal entry created successfully");
        Ok(())
    }

    pub fn update_journal_entry(ctx: Context<UpdateJournalEntry>, title: String, message: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.title = title;
        journal_entry.message = message;
        msg!("Journal entry updated successfully");
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteJournalEntry>, title: String) -> Result<()> {
        msg!("Journal entry deleted successfully {}", title);
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
    pub owner: Pubkey,
    #[max_len(32)]
    pub title: String,
    #[max_len(280)]
    pub message: String,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init, 
        payer = signer, 
        space = 8 + JournalEntryState::INIT_SPACE,
        seeds = [title.as_bytes().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut, 
        seeds = [title.as_bytes().as_ref(), signer.key().as_ref()], 
        bump
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJournalEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut, 
        seeds = [title.as_bytes().as_ref(), signer.key().as_ref()], 
        bump,
        close = signer
    )]
    pub journal_entry: Account<'info, JournalEntryState>,

}