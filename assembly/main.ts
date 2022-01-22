import {  context, PersistentVector, ContractPromiseBatch, u128, RNG } from "near-sdk-as";
import { Roulette, games, GameState } from "./model";


/**
 * Match the gameId and the game.
 */

export function createGame(): u32 {
    const game = new Roulette();
    games.set(game.gameId, game);
    return game.gameId;
}

/**
 * Check if the roulette is rollable. Take the color choices and roll the game if it is.
 */

export function play(gameId: u32, choice: string): string{
    assert(games.contains(gameId), 'Game with this gameId do not exist');
    
    let game = games.getSome(gameId);
    assert(choice == "Red" || choice == "Black" || choice == "Green", "Invalid Choice");
    assert(game.gameState != GameState.Completed)
    
    let message = "";
    if (game.lastChosenItem == "") 
    {
        game.player1 = context.sender;
        game.lastChosenItem = choice;
        game.gameState = GameState.InProgress;
        message = `Player 1 succesfully selected ${choice}`;
    }else
    {
        assert(game.gameState == GameState.InProgress, 'Game is not in progress');
        assert(game.player1 != context.sender,'It is not your turn.');
        game.player2 = context.sender;
        
        message = finishOurGame(game, choice);
        
    }    
    
    games.set(game.gameId, game);
    return message;
}  


/**
 * Finish the game and return the winner(s). 
 */

export function finishOurGame(game: Roulette, choice: string): string{
  game.gameState = GameState.Completed;
  games.set(game.gameId, game);
  let str = "abcdef";
  let color = roll();  

  if(game.lastChosenItem == color && choice == color){
    str = "You both won, congratulations";
  }else if(game.lastChosenItem == color){
    str = `Player with id ${game.player1} won, color is ${color}.`; 
  }else if(choice == color){
    str = `Player with id ${game.player2} won, color is ${color}.`;
  }else{
    str = "Nobody won, remember the house always wins. :(";
  }
  return str;
}

/**
 * roll a number using rng, take the mod 100 of it until it is smaller than 90 then take the mod 30 of it. 
 * If number is equals to 0 color that ball landed is green.
 * If its smaller than 15 color is black. 
 * If its bigger than 14 color is red.
 */

export function roll(): string{

    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    let number = roll % 100;
    while(number > 90){
        roll = rng.next();
        number = roll % 100;
    }
    number = number % 30;
    
    let color = "";
  
    if(number == 0){
      color = "Green";
    }else if(number < 15){
      color = "Black";
    }else{
      color = "Red";
    }
    return color;
  
}
/**
 * This method is for player 2 to join the game. 
 */
export function joinGame(gameId: u32): string {
    assert(games.contains(gameId), 'Game with this ID does not exist. Sorry :(');
    let game = games.getSome(gameId);
    assert(game.player2 == "", 'We already have 2 players. Sorry :(');
    assert(game.player1 != context.sender, 'You cant play with yourself :(');
  
    game.player2 = context.sender;
    game.gameState = GameState.InProgress;
  
    games.set(gameId, game);
  
    return "Successfully joined the game, let's gooo.";
}

  