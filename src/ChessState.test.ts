import { Bool, Field, isReady } from 'snarkyjs';
import ChessState, { Tree } from './ChessState';

describe('ChessState', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('should initialize the state correctly', () => {
    // white pov
    const white_board = new ChessState(Bool(true));
    const white_pov_fen = white_board.generateFen();
    expect(white_pov_fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/8/8');
    console.log(white_pov_fen);

    const black_board = new ChessState(Bool(false));
    const black_pov_fen = black_board.generateFen();
    expect(black_pov_fen).toBe('8/8/8/8/8/8/PPPPPPPP/RNBQKBNR');
    console.log(black_pov_fen);
  });

  // it("should apply moves to squares correctly", () => {
  //   const board = new ChessState(Bool(true));
  //   // a2 up should be a3 if white and a1 if black

  // })
});

describe('Tree', () => {
  beforeEach(async () => {
    await isReady;
  });

  // TODO: put a better name here
  it('should allow you to get squares at a certain depth', () => {
    const b = new Tree(new Field(0));
    const level_one_squares = b.getSquaresAt(0, []);

    expect(level_one_squares.length).toEqual(1);
    expect(level_one_squares[0]).toEqual(new Field(0));

    // add more depth
    let m = b.addTree(new Tree(new Field(1)));
    let n = b.addTree(new Tree(new Field(2)));
    const level_two_squares = b.getSquaresAt(1, []);
    expect(level_two_squares.length).toEqual(2);
    expect(level_two_squares[0]).toEqual(new Field(1));
    expect(level_two_squares[1]).toEqual(new Field(2));

    // add more depth at seperate branch
    m.addTree(new Tree(new Field(5)));
    n.addTree(new Tree(new Field(10)));
    const level_tree_squares = b.getSquaresAt(2, []);
    expect(level_tree_squares.length).toEqual(2);
    expect(level_tree_squares[0]).toEqual(new Field(5));
    expect(level_tree_squares[1]).toEqual(new Field(10));
  });
});
