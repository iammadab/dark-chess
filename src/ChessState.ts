import { Bool, CircuitString, Field, isReady } from 'snarkyjs';

await isReady;

export const PIECE_TO_FIELD_MAP = {
  r: new Field(1),
  n: new Field(2),
  b: new Field(3),
  q: new Field(4),
  k: new Field(5),
  p: new Field(6),
  R: new Field(7),
  N: new Field(8),
  B: new Field(9),
  Q: new Field(10),
  K: new Field(11),
  P: new Field(12),
};
export const EMPTY_SQUARE = new Field(13);
export const HIDDEN_SQUARE = new Field(14);

// Do I need a map for square to field??
// also need a map from field to sqare
// maybe index instead??

export default class ChessState {
  private orientation: Bool;
  private state: Field[] = new Array(64).fill(HIDDEN_SQUARE);

  constructor(orientation: Bool) {
    // either white or black
    if (orientation.toBoolean() == true) {
      this.initWhiteState();
    } else {
      this.initBlackState();
    }
  }

  getState(): Field[] {
    return this.state;
  }

  notationToSquareIndex(file: CircuitString, rank: Field) {
    // const index = SQUARE_TO_NUM[file.toLowerCase()]
    const file_as_string = file.toString();
    const ascii = file_as_string.charCodeAt(0);
    // (x - 97)(8) - 1
    const file_index = 8 * ascii - 777;
    const square_index = file_index + Number(rank.toString());
    return square_index;
  }

  initWhiteState() {
    console.log(this.state);
    // set(a1, white_rook)
    // set(a, 1, white_rook)
  }

  initBlackState() {
    console.log(this.state);
  }
}
