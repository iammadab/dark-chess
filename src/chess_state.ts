// Contain chess game logic
// maintains the state, performs state transitions and allows you to retrive state data

import { Field, isReady } from 'snarkyjs';

// Is this necessary???
await isReady;

export const COLOR = {
  white: Field.fromString('w'),
  black: Field.fromString('b'),
};

export default class ChessState {
  private squares: Field[] = new Array(64).fill(Field.zero);
  private color: Field;

  constructor(color: Field) {
    // need to create initial state
    // what do we need for this?
    // we need to know if the player is white or black to know what pieces to initialize
    if (color.equals(COLOR.white)) {
      this.init_white();
    } else if (color.equals(COLOR.black)) {
      this.init_black();
    } else {
      throw new Error('invalid starting color');
    }

    console.log(this.squares[0]);
    console.log(this.squares[1]);
  }

  init_white() {
    this.squares[0] = Field.one;
  }

  init_black() {
    this.squares[1] = Field.one;
  }
}
