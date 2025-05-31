use anchor_lang::prelude::*;

declare_id!("iAADC1NuKH31rgthtsKMChE1KHG1QTigB8uYmySRRT7");

#[program]
pub mod bootcamp_voting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
