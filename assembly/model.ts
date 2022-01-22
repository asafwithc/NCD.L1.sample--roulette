import {  RNG, context, PersistentMap, u128 } from "near-sdk-as";

/**
 * The persistent map where we store our games.
 */

export const games = new PersistentMap<u32, Roulette>("g");


export enum GameState {
    Created,
    InProgress,
    Completed
}

/**
 * skeleton of our game. Game Id is determined here. 
 */

@nearBindgen
export class Roulette{
  gameId: u32;
  gameState: GameState;
  lastChosenItem: string;
  player1: string;
  player2: string;

  constructor() {
    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    this.gameId = roll;

    this.gameState = GameState.Created;
    this.player1 = context.sender;
    this.player2 = "";
    this.lastChosenItem = "";
  }

}