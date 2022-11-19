import {
  AccountUpdate,
  Bool,
  Mina,
  Poseidon,
  PrivateKey,
  PublicKey,
  Field,
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

function getOrientation(
  playerOrientationHash: Field,
  pubKey: PublicKey,
  otherPlayerPubKey: PublicKey
): Bool {
  let whiteOrientation = Poseidon.hash(
    pubKey.toFields().concat(otherPlayerPubKey.toFields())
  );
  if (whiteOrientation.toString() == playerOrientationHash.toString()) {
    return Bool(true);
  }

  let blackOrientation = Poseidon.hash(
    otherPlayerPubKey.toFields().concat(pubKey.toFields())
  );
  if (blackOrientation.toString() == playerOrientationHash.toString()) {
    return Bool(false);
  }

  // invalid inputs
  throw Error('player orientation hash did not match provided inputs');
}

export { deploy, getOrientation };
