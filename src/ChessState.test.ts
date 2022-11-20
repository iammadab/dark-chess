import { Bool, CircuitString, Field, isReady } from 'snarkyjs';
import ChessState, { HIDDEN_SQUARE } from './ChessState';

describe('ChessState', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('should initialize the state correctly', () => {
    const board = new ChessState(Bool(true));
    const current_board_state = board.getState();
    for (let square of current_board_state) {
      expect(square).toEqual(HIDDEN_SQUARE);
    }

    board.setPieceAt(
      CircuitString.fromString('a'),
      new Field(2),
      CircuitString.fromString('k')
    );
    expect(current_board_state[1].toString()).toEqual('k');
  });
});
