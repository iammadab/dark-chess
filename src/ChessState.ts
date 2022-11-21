import { Bool, CircuitString, Field, isReady } from 'snarkyjs';

await isReady;

export const EMPTY_SQUARE = CircuitString.fromString('e');
export const HIDDEN_SQUARE = CircuitString.fromString('h');

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

export const UP = new Field(1);
export const DOWN = new Field(-1);
export const LEFT = new Field(-8);
export const RIGHT = new Field(8);
export const UP_LEFT = new Field(UP).add(new Field(LEFT));
export const UP_RIGHT = new Field(UP).add(new Field(RIGHT));
export const DOWN_LEFT = new Field(DOWN).add(new Field(LEFT));
export const DOWN_RIGHT = new Field(DOWN).add(new Field(RIGHT));

export default class ChessState {
  private orientation: Bool;
  private state: CircuitString[] = new Array(64).fill(HIDDEN_SQUARE);

  constructor(orientation: Bool) {
    // either white or black
    this.orientation = orientation;
    if (this.orientation.toBoolean() == true) {
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
    // this.setPieceAt(CircuitString.fromString('a'), new Field(2), WHITE_PAWN);
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

  generateFen() {
    // TODO: explain how this does what it does
    // go through all the squares and build some fen string
    let fen_string = '';
    let starting_point = 0;
    let current_index = starting_point;
    let empty_space_count = 0;
    for (let i = 0; i < 64; i++) {
      if (i != 0 && i % 8 == 0) {
        if (empty_space_count != 0) {
          fen_string += empty_space_count;
          empty_space_count = 0;
        }
        fen_string += '/';
      }
      let piece = this.state[current_index].toString();
      if (piece != 'h') {
        if (empty_space_count != 0) {
          fen_string += empty_space_count;
          empty_space_count = 0;
        }
        fen_string += piece;
      } else {
        empty_space_count += 1;
      }
      current_index += 8;
      if (current_index >= 64) {
        starting_point += 1;
        current_index = starting_point;
      }

      if (i == 63 && empty_space_count != 0) {
        fen_string += empty_space_count;
      }
    }
    return fen_string;
  }

  indexAfterMove(
    current_index: Field,
    move_translation: Field,
    isBlack: Bool
  ): Field {
    if (isBlack.toBoolean() == true) {
      return current_index.sub(move_translation);
    } else {
      return current_index.add(move_translation);
    }
  }

  // goal: build a tree for all squares we have pieces on
  // for each piece, we want to decompose the piece's movement

  buildTreeFor(index: Field, piece: CircuitString): Tree {
    const tree = new Tree(index);
    // grab the piece at the index. we should know this already tho
    // depending on what the piece is, we move differently
    if (piece.equals(CircuitString.fromString('r')).toBoolean()) {
      // rook
      this.applyDirection(UP, tree, new Field(3));
    }

    return tree;
  }

  applyDirection(direction: Field, tree: Tree, depth: Field) {
    // add the direction to the index to get the new index
    // perform checks on the index square
    // - not out of bouds
    // - your piece is not on that square
    // if all works out, then create a new tree with the index and recurse
    // if it fails, then stop
    if (depth.equals(new Field(0)).toBoolean()) {
      return;
    }

    let new_index = tree.index.add(direction);
    if (this.isValidSquare(new_index).toBoolean()) {
      const new_tree_node = new Tree(new_index);
      tree.addTree(new_tree_node);
      this.applyDirection(direction, new_tree_node, depth.sub(new Field(1)));
    }
  }

  isValidSquare(index: Field): Bool {
    // grab the content of the square at this index
    // let m = index.lt(0).toBoolean();
    // let n = index.gt(63).toBoolean();
    if (+index.toString() < 0 || +index.toString() > 63) {
      return new Bool(false);
    }
    let square_content = this.state[+index.toString()];
    // how to know if the square contains your piece
    let square_content_as_string = square_content.toString();
    if (square_content_as_string != 'e' && square_content_as_string != 'h') {
      // a piece square, is it a black or white piece
      // this checks if it was already lower case (white in that case)
      let color =
        square_content_as_string.toLowerCase() == square_content_as_string;
      console.log('got here');
      if (color == this.orientation.toBoolean()) {
        return new Bool(false);
      }
    }

    return new Bool(true);
  }

  getTreeIndexValues(tree: Tree, result: Field[]): Field[] {
    result.push(tree.index);
    for (let node of tree.others) {
      result = this.getTreeIndexValues(node, result);
    }
    return result;
  }
}

export class Tree {
  index: Field;
  others: Tree[];

  constructor(index: Field) {
    this.index = index;
    this.others = [];
  }

  addTree(tree: Tree): Tree {
    this.others.push(tree);
    return tree;
  }

  // TODO: can this be a number
  getSquaresAt(depth: Field, result: Field[]): Field[] {
    if (depth.equals(0).toBoolean()) {
      result.push(this.index);
      return result;
    }

    for (let tree of this.others) {
      result = tree.getSquaresAt(depth.sub(new Field(1)), result);
    }

    return result;
  }
}
