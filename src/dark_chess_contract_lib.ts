import {
  AccountUpdate,
  Bool,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
} from 'snarkyjs';
import { DarkChessContract } from './DarkChessContract';

async function deploy(
  darkChessAppInstance: DarkChessContract,
  zkAppPrivateKey: PrivateKey,
  deployerAccount: PrivateKey,
  playerOnePK: PublicKey,
  playerTwoPK: PublicKey
) {
  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    darkChessAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    darkChessAppInstance.playerOrientationHash.set(
      Poseidon.hash(playerOnePK.toFields().concat(playerTwoPK.toFields()))
    );
    darkChessAppInstance.playerTurn.set(Bool(true));
  });
  await deployTxn.send();
}

export { deploy };
