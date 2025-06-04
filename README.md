# Bootcamp Anchor

## Voting DApp

```shell
anchor build

anchor test

anchor deploy
# Build all programs together
anchor build

# (Optional) Deploy just one program:
anchor deploy --programs token_sale

# Deploy everything:
anchor deploy


# 4. 查看新生成的 Program ID
solana address -k target/deploy/crud-keypair.json
```