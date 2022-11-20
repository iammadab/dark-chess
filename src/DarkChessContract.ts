import {
  state,
  SmartContract,
  Field,
  State,
  Bool,
  Permissions,
  DeployArgs,
  method,
  Signature,
  PublicKey,
  Circuit,
  Poseidon,
  CircuitString,
} from 'snarkyjs';

import ChessState from './ChessState';

export class DarkChessContract extends SmartContract {
  @state(Field) playerOrientationHash = State<Field>();
  @state(Field) playerTurn = State<Bool>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proof(),
    });
  }

  @method makeMove(
    signature: Signature,
    pubKey: PublicKey,
    otherPubKey: PublicKey
  ) {
    const board = new ChessState(Bool(true));
    board.notationToSquareIndex(CircuitString.fromString('a'), new Field(1));
    // Need the signature of the player making the move, their public key and that of the other player
    // TODO: Signature should technically contain the move
    //  but not doing that for now, just using this to test access control

    // we need to verify the signature against some public key and message
    signature.verify(pubKey, []).assertEquals(true);

    // need to check if you are the person to move
    // TODO: Add comment to explain what this is doing
    const playerTurn = this.playerTurn.get();
    this.playerTurn.assertEquals(playerTurn);

    const expectedPlayerOrientationHash = Circuit.if(
      playerTurn,
      Poseidon.hash(pubKey.toFields().concat(otherPubKey.toFields())),
      Poseidon.hash(otherPubKey.toFields().concat(pubKey.toFields()))
    );

    const playerOrientationHash = this.playerOrientationHash.get();
    this.playerOrientationHash.assertEquals(playerOrientationHash);

    expectedPlayerOrientationHash.assertEquals(playerOrientationHash);

    // update the player turn
    // TODO: Why do I have to wrap it in bool why can't I just call .not() on playerTurn?
    this.playerTurn.set(Bool(playerTurn).not());
  }
}
