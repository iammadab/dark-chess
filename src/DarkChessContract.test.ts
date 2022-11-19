import { DarkChessContract } from './DarkChessContract';
import { Mina, isReady, PrivateKey } from 'snarkyjs';
import { deploy } from './dark_chess_contract_lib';

describe('DarkChessContract', () => {
  let appInstance: DarkChessContract;

  beforeEach(async () => {
    await isReady;
    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;

    const playerOne = Local.testAccounts[1].privateKey;
    const playerOnePub = playerOne.toPublicKey();
    const playerTwo = Local.testAccounts[2].privateKey;
    const playerTwoPub = playerTwo.toPublicKey();

    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    console.log('generated keys');

    appInstance = new DarkChessContract(zkAppAddress);

    await deploy(
      appInstance,
      zkAppPrivateKey,
      deployerAccount,
      playerOnePub,
      playerTwoPub
    );
  });

  it('initializes state correctly', () => {
    const playerHash = appInstance.playerOrientationHash.get();
    console.log(playerHash);
    const playerTurn = appInstance.playerTurn.get();
    console.log('player turn');
    console.log(playerTurn);
  });
});

// Why this??
export {};
