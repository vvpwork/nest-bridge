## Need to accomplish

1. Move all blockchain operation to worker (create general message interface)
2. Refactor Profile, Likes, News (all endpoints where we have many useless transaction)&& check atomicity trabsactions 
3. Add chain id to trans action history && also currencies
4. Refactor selects (mive to separate files or broke into parts ) 
5. Add consumer class to Blockchain worker remove useless code !!!
6. Create submodules fro db and common (or move to general path)
7. Group global modules
8. Add cache to get nft ( get nft url )
9. Add listeners for Mint and Transfer Nft (done just refactor);
10. Add validate user balance before create order (done refactor)
11. Sort from created order()
12. Add event listenre to finilize pool (staking listener) 
13. Save black list pull staking;
14. Move all blockchain operation to worker (rpc call from api to worker &&  listeners map in redux)
15. Add balance of coins to trans history
16. Add EndToEnd tests 
