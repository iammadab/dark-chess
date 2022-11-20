import { Bool, CircuitString, Field, isReady } from 'snarkyjs';

await isReady;

export const EMPTY_SQUARE = new Field(13);
export const HIDDEN_SQUARE = CircuitString.fromString('hidden');

// Do I need a map for square to field??
// also need a map from field to sqare
// maybe index instead??

// TODO: implement castling

const WHITE_ROOK = CircuitString.fromString('r');
const WHITE_KNIGHT = CircuitString.fromString('n');
const WHITE_BISHOP = CircuitString.fromString('b');
const WHITE_QUEEN = CircuitString.fromString('q');
const WHITE_KING = CircuitString.fromString('k');
const WHITE_PAWN = CircuitString.fromString('p');

const BLACK_ROOK = CircuitString.fromString('R');
const BLACK_KNIGHT = CircuitString.fromString('N');
const BLACK_BISHOP = CircuitString.fromString('B');
const BLACK_QUEEN = CircuitString.fromString('Q');
const BLACK_KING = CircuitString.fromString('K');
const BLACK_PAWN = CircuitString.fromString('P');

export default class ChessState {
  private orientation: Bool;
  private state: CircuitString[] = new Array(64).fill(HIDDEN_SQUARE);

  constructor(orientation: Bool) {
    // either white or black
    if (orientation.toBoolean() == true) {
      this.initWhiteState();
    } else {
      this.initBlackState();
    }
  }

  getState(): CircuitString[] {
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

  setPieceAt(file: CircuitString, rank: Field, piece: CircuitString) {
    const piece_index = this.notationToSquareIndex(file, rank);
    this.state[piece_index] = piece;
  }

  initWhiteState() {
    this.setPieceAt(CircuitString.fromString('a'), new Field(1), WHITE_ROOK);
    this.setPieceAt(CircuitString.fromString('b'), new Field(1), WHITE_KNIGHT);
    this.setPieceAt(CircuitString.fromString('c'), new Field(1), WHITE_BISHOP);
    this.setPieceAt(CircuitString.fromString('d'), new Field(1), WHITE_QUEEN);
    this.setPieceAt(CircuitString.fromString('e'), new Field(1), WHITE_KING);
    this.setPieceAt(CircuitString.fromString('f'), new Field(1), WHITE_BISHOP);
    this.setPieceAt(CircuitString.fromString('g'), new Field(1), WHITE_KNIGHT);
    this.setPieceAt(CircuitString.fromString('h'), new Field(1), WHITE_ROOK);
    this.setPieceAt(CircuitString.fromString('a'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('b'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('c'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('d'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('e'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('f'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('g'), new Field(2), WHITE_PAWN);
    this.setPieceAt(CircuitString.fromString('h'), new Field(2), WHITE_PAWN);
  }

  initBlackState() {
    this.setPieceAt(CircuitString.fromString('a'), new Field(8), BLACK_ROOK);
    this.setPieceAt(CircuitString.fromString('b'), new Field(8), BLACK_KNIGHT);
    this.setPieceAt(CircuitString.fromString('c'), new Field(8), BLACK_BISHOP);
    this.setPieceAt(CircuitString.fromString('d'), new Field(8), BLACK_QUEEN);
    this.setPieceAt(CircuitString.fromString('e'), new Field(8), BLACK_KING);
    this.setPieceAt(CircuitString.fromString('f'), new Field(8), BLACK_BISHOP);
    this.setPieceAt(CircuitString.fromString('g'), new Field(8), BLACK_KNIGHT);
    this.setPieceAt(CircuitString.fromString('h'), new Field(8), BLACK_ROOK);
    this.setPieceAt(CircuitString.fromString('a'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('b'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('c'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('d'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('e'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('f'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('g'), new Field(7), BLACK_PAWN);
    this.setPieceAt(CircuitString.fromString('h'), new Field(7), BLACK_PAWN);
  }
}
