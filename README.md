# Roulette Game as a NEAR contract


## Install Dependencies Using
```
yarn
```

## Build and Deploy the contract Using
```
yarn build
near dev-deploy ./out/main.wasm
# save the contract id and send it to other player
```

## How to Play

1. Player 1 calls the function `createGame` and sends gameId to other player.
2. Player 2 calls function `joinGame(gameId)` passing gameId as only parameter. 
3. Player 1 is the first to play, calling function `play(gameId, choice)` with game id and color choice as arguments.
4. Player 2 repeats the procedure.
5. Roulette spins and player that chose the true color wins.

## Run the game
**Create a game**
```
near call <contract-id> createGame --account_id <account-id> 
# save the game id and send it to your friend
```

**Join a game (player 2)**
```
near call <contract-id> joinGame '{"gameId": <game-id>}' --account_id <account-id> 
```

**Play the game**
```
near call <contract-id> play '{"gameId": <game-id>, "choice": <your color choice>}' --account_id <account-id>
```


