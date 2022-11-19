import { DarkChessContract } from './DarkChessContract';
import {
  Mina,
  isReady,
  PrivateKey,
  PublicKey,
  Field,
  Poseidon,
} from 'snarkyjs';
import { deploy } from './dark_chess_contract_lib';

describe('DarkChessContract', () => {
  let appInstance: DarkChessContract;
  let playerOnePK: PublicKey;
  let playerTwoPK: PublicKey;

  beforeEach(async () => {
    await isReady;

    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;

    playerOnePK = Local.testAccounts[1].privateKey.toPublicKey();
    playerTwoPK = Local.testAccounts[2].privateKey.toPublicKey();

    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    appInstance = new DarkChessContract(zkAppAddress);

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
});

// Why this??
export {};
