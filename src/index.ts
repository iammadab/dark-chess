import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  AccountUpdate,
  Poseidon,
  Bool,
} from 'snarkyjs';
import { DarkChessContract } from './DarkChessContract.js';

async function runChessContract() {
  await isReady;
  console.log('Snarky loaded');
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

  const appInstance = new DarkChessContract(zkAppAddress);

  console.log('created app instance');

  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    console.log('funded account');
    appInstance.deploy({ zkappKey: zkAppPrivateKey });
    console.log('about to deploy');
    // appInstance.initState(playerOnePub, playerTwoPub);
    // appInstance.requireSignature();
    appInstance.playerOrientationHash.set(
      Poseidon.hash(playerOnePub.toFields().concat(playerTwoPub.toFields()))
    );

    // TODO: Move this documentation to the state
    // true means white to play, false means black
    appInstance.playerTurn.set(Bool(true));
  });
  console.log('sending tx');
  await deployTxn.send();
  console.log('sent tx');

  const playerHash = appInstance.playerOrientationHash.get();
  console.log(playerHash);
  const playerTurn = appInstance.playerTurn.get();
  console.log(playerTurn);

  console.log('shutting down');
  await shutdown();
}

runChessContract();
// main()
