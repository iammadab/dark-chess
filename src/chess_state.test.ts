import { isReady } from 'snarkyjs';
import ChessState, { COLOR } from './chess_state';

describe('chess_state.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('chess_state()', () => {
    let a = new ChessState(COLOR.white);
    console.log(a);
    it.todo('should be correct');
  });
});
