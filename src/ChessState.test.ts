import { Bool, isReady } from 'snarkyjs';
import ChessState from './ChessState';

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
});
