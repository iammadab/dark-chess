import { DarkChessContract } from './DarkChessContract';
import {
  Mina,
  isReady,
  PrivateKey,
  PublicKey,
  Field,
  Poseidon,
  Bool,
  Signature,
} from 'snarkyjs';
import { deploy, getOrientation } from './dark_chess_contract_lib';

describe('DarkChessContract', () => {
  let appInstance: DarkChessContract;
  let deployerAccount: PrivateKey;
  let playerOneSK: PrivateKey;
  let playerTwoSK: PrivateKey;
  let playerOnePK: PublicKey;
  let playerTwoPK: PublicKey;

  beforeEach(async () => {
    await isReady;

    const Local = Mina.LocalBlockchain({
      proofsEnabled: false,
    });
    Mina.setActiveInstance(Local);
    deployerAccount = Local.testAccounts[0].privateKey;

    playerOneSK = Local.testAccounts[1].privateKey;
    playerTwoSK = Local.testAccounts[2].privateKey;
    playerOnePK = playerOneSK.toPublicKey();
    playerTwoPK = playerTwoSK.toPublicKey();

    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    appInstance = new DarkChessContract(zkAppAddress);

    console.log('Starting compilation');
    await DarkChessContract.compile();
    console.log('Finished compilation');

    await deploy(
      appInstance,
      zkAppPrivateKey,
      deployerAccount,
      playerOnePK,
      playerTwoPK
    );
  });

  it('initializes state correctly', () => {
    // assert that white is first to play
    const playerTurn = appInstance.playerTurn.get();
    expect(playerTurn.toString()).toBe(new Field(1).toString());

    const playerOrientationHash = appInstance.playerOrientationHash.get();
    // player one should be white and player two should be black
    const expectedPlayerOrientationHash = Poseidon.hash(
      playerOnePK.toFields().concat(playerTwoPK.toFields())
    );
    const wrongExpectedPlayerOrientationHash = Poseidon.hash(
      playerTwoPK.toFields().concat(playerOnePK.toFields())
    );
    expect(playerOrientationHash.toString()).toBe(
      expectedPlayerOrientationHash.toString()
    );
    expect(playerOrientationHash.toString()).not.toBe(
      wrongExpectedPlayerOrientationHash.toString()
    );
  });

  it('allows players get their correct orientation', () => {
    const playerOrientationHash = appInstance.playerOrientationHash.get();

    // check that player one is white
    const playerOneOrientation = getOrientation(
      playerOrientationHash,
      playerOnePK,
      playerTwoPK
    );
    expect(playerOneOrientation).toEqual(Bool(true));

    // check that player two is black
    const playerTwoOrientation = getOrientation(
      playerOrientationHash,
      playerTwoPK,
      playerOnePK
    );
    expect(playerTwoOrientation).toEqual(Bool(false));

    // throws an error for wrong inputs
    try {
      getOrientation(
        playerOrientationHash,
        playerOnePK,
        PrivateKey.random().toPublicKey()
      );
      expect(true).toBe(false);
    } catch {
      // do nothing, we are good
    }
  });

  it('allows only player with current turn to make a move', async () => {
    // Player 2 should not be able to make a move
    try {
      const playerTwoSig = Signature.create(playerTwoSK, []);
      // TODO: use tx here
      appInstance.makeMove(playerTwoSig, playerTwoPK, playerOnePK);
      expect(true).toBe(false);
    } catch {
      // do nothing, we are good
    }

    // Player 1 should be able to make a move
    const playerOneSig = Signature.create(playerOneSK, []);
    const txn1 = await Mina.transaction(deployerAccount, () => {
      appInstance.makeMove(playerOneSig, playerOnePK, playerTwoPK);
    });
    await txn1.prove();
    await txn1.send();

    // player turn should change after a move
    expect(appInstance.playerTurn.get().toString()).toBe(
      new Field(0).toString()
    );

    // Player 2 should be able to make a move now
    const playerTwoSig = Signature.create(playerTwoSK, []);
    const txn2 = await Mina.transaction(deployerAccount, () => {
      appInstance.makeMove(playerTwoSig, playerTwoPK, playerOnePK);
    });
    await txn2.prove();
    await txn2.send();

    // player turn should change after a move
    expect(appInstance.playerTurn.get().toString()).toBe(
      new Field(1).toString()
    );
  });
});

// Why this??
export {};
